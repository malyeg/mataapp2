import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  DataCollection,
  DataSearchable,
  Entity,
  Filter,
  Operation,
  Query,
} from '../types/DataTypes';
import {DocumentSnapshot, QuerySnapshot} from '../types/UtilityTypes';
import cache, {CacheConfig} from '../utils/cache/cacheManager';
import {allCombinations} from '../utils/CommonUtils';
import {Api, APIOptions, ApiResponse} from './Api';

const DEFAULT_LIMIT = 100;

// TODO transform firebase errors

export class DataApi<T extends DataSearchable & Entity> extends Api {
  constructor(
    readonly collection: DataCollection<T>,
    readonly cacheStore: string,
  ) {
    super();
  }

  onDocumentSnapshot = (
    docId: string,
    observerCallback: (snapshot: DocumentSnapshot<T>) => void,
  ) => {
    return this.collection.doc(docId).onSnapshot(observerCallback);
  };
  onQuerySnapshot = (
    observerCallback: (snapshot: QuerySnapshot<T>) => void,
    onError?: ((error: Error) => void) | undefined,
    query?: Query<T>,
  ) => {
    try {
      let collectionQuery:
        | FirebaseFirestoreTypes.Query<T>
        | DataCollection<T>
        | null = this.collection;
      if (query) {
        if (query.filters && query.filters.length > 0) {
          for (const filter of query.filters) {
            if (filter.operation === Operation.CONTAINS) {
              collectionQuery = this.collection.where(
                'searchArray',
                'array-contains',
                filter.value,
              );
            } else {
              collectionQuery = this.collection.where(
                filter.field as any,
                filter.operation ?? Operation.EQUAL,
                filter.value,
              );
            }
          }
        }
        if (query.orderBy && query.orderBy.length > 0) {
          for (const sort of query.orderBy) {
            collectionQuery = collectionQuery.orderBy(
              sort.field as unknown as FirebaseFirestoreTypes.FieldPath,
              sort.direction || 'asc',
            );
          }
        }
      }
      if (query?.afterDoc) {
        collectionQuery = collectionQuery.startAfter(query?.afterDoc);
      }
      return collectionQuery
        .limit(query?.limit || DEFAULT_LIMIT)
        .onSnapshot(observerCallback);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  };

  getAll = async (query?: Query<T>, options?: APIOptions) => {
    try {
      const cacheKey = this.buildKeyFrom(options?.cache!, query);
      if (options?.cache?.enabled && !query?.afterDoc) {
        const cachedResponse = await cache.get(cacheKey);
        if (cachedResponse) {
          return cachedResponse as ApiResponse<T>;
        }
      }
      this.logger.debug('getAll query:', query);
      const coll = query ? this.fromQuery(query) : this.collection;
      const snapshot = await coll.get();
      const items = snapshot.docs.map(doc => {
        return {
          ...doc.data(),
          timestamp: (doc.data()?.timestamp as any)?.toDate(),
          id: doc.id,
        } as T;
      });
      if (items && items.length > 0) {
        const response: ApiResponse<T> = {items, query};
        if (!!query?.limit && items.length === query.limit) {
          response.lastDoc = snapshot.docs.slice(-1)[0];
        }
        if (options?.cache?.enabled && !response.lastDoc) {
          JSON.stringify({items, query});
          cache.store(cacheKey, response);
        }
        return response;
      }
    } catch (error) {
      console.error(error);
    }
  };

  getById = async (id: string, options?: APIOptions) => {
    this.logger.debug('getById:', id);
    if (options?.cache?.enabled) {
      const doc = await cache.get(id);
      if (doc) {
        console.log(doc);
        return doc as T;
      }
    }
    const snapshot = await this.collection.doc(id).get();
    if (snapshot.exists) {
      const doc = {
        ...snapshot.data(),
        timestamp: (snapshot?.data()?.timestamp as any)?.toDate(),
        id,
      } as T;
      !!options?.cache?.enabled &&
        (await cache.store(id, doc, options.cache.expireInSeconds));

      return doc;
    }
  };

  add = async (
    doc: Omit<T, 'id'>,
    // searchable?: {keywords: string[]},
    options?: APIOptions,
  ) => {
    try {
      const newDoc = this.removeEmpty(doc as T);
      if (
        options &&
        options.searchable &&
        options.searchable.keywords.length > 0
      ) {
        let searchArray = [];
        for (const field of options.searchable.keywords) {
          const compinations = allCombinations(field);
          searchArray.push(...compinations);
        }
        newDoc.searchArray = [...new Set(searchArray)];
      }
      const timestamp = firestore.FieldValue.serverTimestamp();
      const id = await this.collection.doc().id;
      const createdDoc: T = {...newDoc, timestamp};
      await this.collection.doc(id).set(createdDoc);
      createdDoc.id = id;
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent)?.then();
      if (options?.cache?.enabled) {
        await cache.store(id, createdDoc, options.cache.expireInSeconds);
      }
      !!options?.cache?.evict && (await cache.remove(options?.cache?.evict));
      return createdDoc as T;
    } catch (error) {
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent, 'error')?.then();
      throw error;
    }
  };

  set = async (
    id: string,
    doc: T,
    searchable?: {keywords: string[]},
    options?: APIOptions,
  ) => {
    try {
      this.logger.debug('set:', doc);
      const newDoc = this.removeEmpty(doc as T);
      if (searchable && searchable.keywords.length > 0) {
        newDoc.searchArray = this.getSearchArray(searchable);
      }
      const timestamp = firestore.FieldValue.serverTimestamp();
      const createdDoc = {...newDoc, timestamp};
      await this.collection.doc(id).set(createdDoc);
      createdDoc.id = id;
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent)?.then();
      if (options?.cache?.enabled) {
        await cache.store(id, createdDoc, options?.cache?.expireInSeconds);
      }
      !!options?.cache?.evict && (await cache.remove(options?.cache?.evict));
      return newDoc;
    } catch (error) {
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent, 'error')?.then();
      throw error;
    }
  };

  update = async (doc: Partial<T>, options?: APIOptions) => {
    try {
      this.logger.debug('update:', doc);
      cache.remove(doc.id!);
      const newDoc = {...doc};
      delete newDoc.timestamp;
      await this.collection.doc(doc.id).update(newDoc);
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent)?.then();
      if (options?.cache?.enabled) {
        console.warn('not supported');
        // cache.store(doc.id!, doc, options.cache.expireInSeconds);
      }
      !!options?.cache?.evict && (await cache.remove(options?.cache?.evict));
    } catch (error) {
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent, 'error')?.then();
      throw error;
    }
  };

  deleteById = async (docId: string, options?: APIOptions) => {
    try {
      this.logger.debug('deleteById:', docId);
      await this.collection.doc(docId).delete();
      !!options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent)?.then();
      await cache.remove(docId);
      !!options?.cache?.evict && (await cache.remove(options?.cache?.evict));
    } catch (error) {
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent, 'error')?.then();
      throw error;
    }
  };

  delete = async (doc: Entity, options?: APIOptions) => {
    try {
      this.logger.debug('delete:', doc);
      await this.collection.doc(doc.id).delete();
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent)?.then();
      await cache.remove(doc.id);
      !!options?.cache?.evict && (await cache.remove(options?.cache?.evict));
    } catch (error) {
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent, 'error')?.then();
      throw error;
    }
  };

  private getSearchArray = (searchable: {keywords: string[]}) => {
    if (searchable && searchable.keywords.length > 0) {
      let searchArray = [];
      for (const field of searchable.keywords) {
        const compinations = allCombinations(field);
        searchArray.push(...compinations);
      }
      return [...new Set(searchArray)];
    }
  };

  private removeEmpty = (obj: T) => {
    return JSON.parse(JSON.stringify(obj));
  };

  fromQuery = (
    query: Query<T>,
    collectionQuery: FirebaseFirestoreTypes.Query<T> | DataCollection<T> = this
      .collection,
  ) => {
    if (query.filters && query.filters.length > 0) {
      for (const filter of query.filters) {
        const idField = filter.field === 'id' ? '__name__' : filter.field;
        const newFilter: Filter<T> = {...filter, field: idField};
        if (filter.operation === Operation.CONTAINS) {
          collectionQuery = collectionQuery.where(
            'searchArray',
            Operation.CONTAINS,
            newFilter.value,
          );
        } else {
          const operation: Operation = newFilter.operation
            ? newFilter.operation
            : Operation.EQUAL;
          collectionQuery = collectionQuery.where(
            newFilter.field as any,
            operation,
            newFilter.value,
          );
        }
      }
    }
    if (query.orderBy && query.orderBy.length > 0) {
      for (const sort of query.orderBy) {
        collectionQuery = collectionQuery.orderBy(
          sort.field as unknown as FirebaseFirestoreTypes.FieldPath,
          sort.direction || 'asc',
        );
      }
    }
    if (query.afterDoc) {
      collectionQuery = collectionQuery.startAfter(query.afterDoc);
    }
    if (query.limit) {
      collectionQuery = collectionQuery.limit(query.limit);
    }
    // this.logger.debug(collectionQuery.);
    return collectionQuery;
  };

  private buildKeyFrom = (cacheConfig: CacheConfig, query?: Query<T>) => {
    const key =
      cacheConfig?.key ??
      `${this.cacheStore}_${query ? JSON.stringify(query) : ''}`;
    return key;
  };
}

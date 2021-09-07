import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Config from 'react-native-config';
import '@react-native-firebase/functions';
import constants from '../config/constants';
import {
  DataCollection,
  Entity,
  Filter,
  Operation,
  Query,
} from '../types/DataTypes';
import {DocumentSnapshot, QuerySnapshot} from '../types/UtilityTypes';
// import {DocumentSnapshot, QuerySnapshot} from '../types/UtilityTypes';
import cache, {CacheConfig} from '../utils/cache/cacheManager';
import {allCombinations} from '../utils/CommonUtils';
import {Api, APIOptions, ApiResponse} from './Api';
import {FirebaseFunctionsTypes} from '@react-native-firebase/functions';
export class DataApi<T extends Entity> extends Api {
  collection: DataCollection<T>;
  cacheStore: string;
  functions: FirebaseFunctionsTypes.Module;
  constructor(readonly collectionName: string) {
    super();
    this.functions = firebase.app().functions(constants.firebase.REGION);
    this.collection = firestore().collection<T>(
      Config.SCHEMA_PREFIX + collectionName,
    );
    this.cacheStore = collectionName;
  }

  onDocumentSnapshot = (
    id: string,
    observerCallback: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void,
  ) => {
    this.logger.debug('onDocumentSnapshot', id);
    return this.collection.doc(id).onSnapshot(snapshot => {
      const timestamp = (snapshot.data()?.timestamp as any)?.toDate();
      const doc = snapshot.data()
        ? {
            ...snapshot.data(),
            id: snapshot.id,
            timestamp,
          }
        : undefined;
      observerCallback({...snapshot, doc});
    }, onError);
  };

  onQuerySnapshot = (
    observerCallback: (snapshot: QuerySnapshot<T>) => void,
    onError?: ((error: Error) => void) | undefined,
    query?: Query<T>,
  ) => {
    this.logger.debug('onQuerySnapshot', query);

    let collectionQuery = query
      ? this.getQuery(query, this.collection)
      : this.collection;

    return collectionQuery.onSnapshot(snapshot => {
      this.logger.debug('onQuerySnapshot observerCallback');
      const data: T[] = snapshot.docs.map(doc => {
        const timestamp = (doc.data()?.timestamp as any)?.toDate();
        const item: T = {
          ...doc.data(),
          id: doc.id,
          timestamp,
        };
        return item;
      });
      observerCallback({...snapshot, data});
    }, onError);
  };

  getAll = async (query?: Query<T>, options?: APIOptions) => {
    try {
      let cacheKey: string;
      if (options?.cache?.enabled) {
        cacheKey = this.buildKeyFrom(options?.cache!, query);
        const cachedResponse = await cache.get(cacheKey);
        if (cachedResponse) {
          this.logger.debug('getAll query (cached):', query);
          return cachedResponse as ApiResponse<T>;
        }
      }
      this.logger.debug('getAll query:', query);
      const coll = query ? this.getQuery(query) : this.collection;
      const snapshot = await coll.get();
      const items = snapshot.docs.map(doc => {
        return {
          ...doc.data(),
          timestamp: (doc.data()?.timestamp as any)?.toDate(),
          id: doc.id,
        } as T;
      });
      if (items && items.length > 0) {
        const response: ApiResponse<T> = {items, query, docs: snapshot.docs};
        if (!!query?.limit && items.length === query.limit) {
          response.lastDoc = snapshot.docs.slice(-1)[0];
        }
        if (options?.cache?.enabled) {
          cache.store(cacheKey!, response);
        }
        return response;
      }
    } catch (error) {
      this.logger.error(error);
    }
  };

  getById = async (id: string, options?: APIOptions) => {
    if (options?.cache?.enabled) {
      const doc = await cache.get(id);
      if (doc) {
        this.logger.debug('getById (cached):', id);
        return doc as T;
      }
    }
    this.logger.debug('getById:', id);
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

  add = async (doc: Omit<T, 'id'>, options?: APIOptions) => {
    try {
      this.logger.debug('add:', doc);
      const newDoc = this.removeEmpty(doc as T);
      if (
        options &&
        options.searchable &&
        options.searchable.keywords.length > 0
      ) {
        let searchArray = [];
        for (const field of options.searchable.keywords) {
          const combinations = allCombinations(field);
          searchArray.push(...combinations);
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
      !!options?.cache?.evict && (await this.evict(options?.cache?.evict));
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
      !!options?.cache?.evict && (await this.evict(options?.cache?.evict));
      return newDoc;
    } catch (error) {
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent, 'error')?.then();
      throw error;
    }
  };

  update = async (id: string, doc: Partial<T>, options?: APIOptions) => {
    try {
      this.logger.debug('update:', doc);
      cache.remove(id);
      const newDoc = {...doc};
      delete newDoc.timestamp;
      await this.collection.doc(id).update(newDoc);
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent)?.then();
      if (options?.cache?.enabled) {
        console.warn('not supported');
      }
      !!options?.cache?.evict && (await this.evict(options?.cache?.evict));
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
      console.log('after delete');
      !!options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent)?.then();
      await cache.remove(docId);
      !!options?.cache?.evict && (await this.evict(options?.cache?.evict));
    } catch (error) {
      console.error(error);
      !!options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent, 'error')?.then();
      throw error;
    }
  };

  delete = async (doc: T, options?: APIOptions) => {
    try {
      this.logger.debug('delete:', doc);
      await this.collection.doc(doc.id).delete();
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent)?.then();
      await cache.remove(doc.id);
      !!options?.cache?.evict && (await this.evict(options?.cache?.evict));
    } catch (error) {
      options?.analyticsEvent &&
        this.callAnalytics(options?.analyticsEvent, 'error')?.then();
      throw error;
    }
  };

  private evict = (list: string | string[]) => {
    const promises: Promise<void>[] = [];
    if (Array.isArray(list)) {
      list.forEach(item => {
        promises.push(cache.remove(item));
      });
    } else {
      promises.push(cache.remove(list));
    }
    return Promise.all(promises);
  };

  private getSearchArray = (searchable: {keywords: string[]}) => {
    if (searchable && searchable.keywords.length > 0) {
      let searchArray = [];
      for (const field of searchable.keywords) {
        const combinations = allCombinations(field);
        searchArray.push(...combinations);
      }
      return [...new Set(searchArray)];
    }
  };

  private removeEmpty = (obj: T) => {
    return JSON.parse(JSON.stringify(obj));
  };

  private getQuery = (
    query: Query<T>,
    collectionQuery: FirebaseFirestoreTypes.Query<T> | DataCollection<T> = this
      .collection,
  ) => {
    return DataApi.fromQuery(query, collectionQuery);
  };

  private buildKeyFrom = (cacheConfig: CacheConfig, query?: Query<T>) => {
    const key =
      cacheConfig?.key ??
      `${this.cacheStore}_${query ? JSON.stringify(query) : ''}`;
    return key;
  };

  static fromQuery<E>(
    query: Query<E>,
    collectionQuery: FirebaseFirestoreTypes.Query<E> | DataCollection<E>,
  ) {
    if (query.filters && query.filters.length > 0) {
      for (const filter of query.filters) {
        if (!!filter.field && filter.value !== undefined) {
          const idField = filter.field === 'id' ? '__name__' : filter.field;
          const newFilter: Filter<E> = {...filter, field: idField};
          const operation: Operation = newFilter.operation
            ? newFilter.operation
            : Operation.EQUAL;

          collectionQuery = collectionQuery.where(
            newFilter.field as any,
            operation.toString() as FirebaseFirestoreTypes.WhereFilterOp,
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
    collectionQuery = collectionQuery.limit(
      query.limit ?? constants.firebase.MAX_QUERY_LIMIT,
    );

    return collectionQuery;
  }
}

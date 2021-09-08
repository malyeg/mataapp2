import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {FieldError as FieldErrorBase} from 'react-hook-form';
import {Country} from '../api/countriesApi';

export type DataCollection<T> = FirebaseFirestoreTypes.CollectionReference<T>;

export type Field<T> = keyof T;

export enum Operation {
  EQUAL = '==',
  NOT_EQUAL = '!=',
  GREATER_THAN = '>',
  GREATER_OR_EQUAL_THAN = '>=',
  LESS_THAN = '<',
  LESS_OR_EQUAL_THAN = '>=',
  IN = 'in',
  NOT_IN = 'not-in',
  CONTAINS = 'array-contains', // model must implement DataSearchable
}

export type Filter<T> = {
  field: string;
  value: any;
  operation?: Operation;
  readonly?: boolean;
};

export type Page = {
  size: number;
  index?: number;
};
export interface Query<T> {
  filters?: Filter<T>[];
  limit?: number;
  orderBy?: Sort[];
  page?: Page;
  // afterDoc?: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>;
}

export type Sort = {
  field: string;
  direction?: SortDirection;
};

export type SortDirection = 'asc' | 'desc' | undefined;

export class QueryBuilder<T> {
  private readonly _query: Query<T>;
  readonly filtersMap: Map<string, Filter<T>> = new Map();

  constructor(query?: Query<T>) {
    if (query) {
      this._query = {...query};
      if (query.filters) {
        query.filters.forEach(filter =>
          this.filtersMap.set(filter.field, filter),
        );
      }
    } else {
      this._query = {filters: [], orderBy: []};
    }
  }

  // eslint-disable-next-line no-shadow
  static fromQuery<T>(query: Query<T>) {
    return new QueryBuilder(query);
  }
  // eslint-disable-next-line no-shadow
  static from<T extends Entity>(query: Partial<Query<T>>) {
    const qb = new QueryBuilder<T>(query);
    !!query.limit && qb.limit(query.limit);
    !!query.filters && qb.filters(query.filters);
    !!query.orderBy && qb.orderByList(query.orderBy);
    // !!query.page && qb.page(query.page);
    return qb.build();
  }

  filter(
    field: string,
    value: any,
    operation: Operation = Operation.EQUAL,
  ): QueryBuilder<T> {
    const filter: Filter<T> = {field, value, operation};
    this.filtersMap.set(field, filter);
    return this;
  }
  filters(filters: Filter<T>[]): QueryBuilder<T> {
    this._query.filters = filters;
    this.filtersMap.clear();
    filters.forEach(filter => this.filtersMap.set(filter.field, filter));
    return this;
  }
  addToFilters(filters: Filter<T>[]): QueryBuilder<T> {
    filters.forEach(filter => this.filtersMap.set(filter.field, filter));
    return this;
  }
  limit(limit: number): QueryBuilder<T> {
    this._query.limit = limit;
    return this;
  }
  after(
    doc?: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>,
  ): QueryBuilder<T> {
    if (doc) {
      this._query.afterDoc = doc;
    }
    return this;
  }
  orderBy(field: string, direction: SortDirection): QueryBuilder<T> {
    if (!this._query.orderBy) {
      this._query.orderBy = [];
    }

    this._query.orderBy.push({field, direction});

    return this;
  }

  orderByList(sortList: Sort[]): QueryBuilder<T> {
    this._query.orderBy = sortList;
    return this;
  }

  build(): Query<T> {
    this._query.filters = Array.from(this.filtersMap.values());
    return this._query;
  }

  static filterFrom = <T>(
    field: string,
    value: string,
    operation: Operation = Operation.EQUAL,
  ) => {
    return {field, operation, value} as Filter<T>;
  };
  static queryFrom<T>(
    filters: Filter<T>[],
    limit: number = 100,
    orderBy?: Sort[],
  ) {
    return {filters, limit, orderBy};
  }

  static equal<I>(q1?: Query<I>, q2?: Query<I>) {
    if (!!q1 && !!q2) {
      return JSON.stringify(q1) === JSON.stringify(q2);
    }
    return false;
  }

  static emptyQuery<T extends Entity>() {
    return new QueryBuilder<T>().build();
  }
}
export interface DataSearchable {
  searchArray?: string[];
}

export interface Nestable {
  parent?: string;
  level: number;
}
export interface Entity extends DataSearchable {
  // value: string;
  id: string;
  name?: string;
  timestamp?: Date;
  userId: string;
  user: {
    id: string;
    name?: string;
    email?: string;
  };
}

// Form types
export interface FieldError extends FieldErrorBase {
  code?: string;
  params?: {[key: string]: string | number};
}

export interface FormProps {
  name: string;
  control: any;
  defaultValue?: string | boolean | object;
}

export type PickerFieldItem = {
  value: string;
  label?: string;
  emoji?: string;
};

export interface Status {
  code?: string;
  message: string;
  type?: 'warn' | 'error' | 'info' | 'success';
  options?: {
    duration?: number;
    position?: 'top' | 'bottom';
    autoHide?: boolean;
  };
  params?: {[key: string]: string | number};
}

// Locaion types
export interface Coordinate {
  latitude: number;
  longitude: number;
  // latitudeDelta: number;
  // longitudeDelta: number;
}
export interface Location {
  coordinate: Coordinate;
  address?: {
    name: string;
    formattedAddress: string;
  };
  city?: string;
  country?: Country;
  placeId?: string;
  position?: {x: number; y: number};
}

export type Document<T> = FirebaseFirestoreTypes.QueryDocumentSnapshot<T>;

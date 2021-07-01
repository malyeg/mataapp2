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
};

export type Page<T> = {
  size: number;
  index?: number;
};
export interface Query<T> {
  filters?: Filter<T>[];
  limit?: number;
  orderBy?: Sort<T>[];
  page?: Page<T>;
  afterDoc?: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>;
}

export type Sort<T> = {
  field: string;
  direction?: 'asc' | 'desc';
};

export class QueryBuilder<T> {
  private readonly _query: Query<T>;

  constructor(query?: Query<T>) {
    if (query) {
      this._query = {...query};
    } else {
      this._query = {filters: [], orderBy: []};
    }
  }

  static from<T>(query: Query<T>) {
    return new QueryBuilder(query);
  }

  filter(
    field: string,
    value: any,
    operation: Operation = Operation.EQUAL,
  ): QueryBuilder<T> {
    if (!this._query.filters) {
      this._query.filters = [];
    }
    !!field && this._query.filters.push({field, value, operation});
    return this;
  }
  filters(filter: Filter<T>[]): QueryBuilder<T> {
    this._query.filters = filter;
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
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    if (!this._query.orderBy) {
      this._query.orderBy = [];
    }
    this._query.orderBy.push({field, direction});
    return this;
  }

  build(): Query<T> {
    return this._query;
  }

  static filterFrom = <T>(
    field: string,
    value: string,
    operation: Operation = Operation.EQUAL,
  ) => {
    return {field, operation, value} as Filter<T>;
  };
  static queryFrom = <T>(
    filters: Filter<T>[],
    limit: number = 100,
    orderBy?: Sort<T>[],
  ) => {
    return {filters, limit, orderBy};
  };
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
}

// Form types
export interface FieldError extends FieldErrorBase {
  code?: string;
  params?: {[key: string]: string | number};
}

export interface FormProps {
  name: string;
  control: any;
  defaultValue?: string | object;
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

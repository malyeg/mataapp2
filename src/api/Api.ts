import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Document, Query} from '../types/DataTypes';
import Analytics, {AnalyticsEvent} from '../utils/Analytics';
import {CacheConfig} from '../utils/cache/cacheManager';
import {LoggerFactory} from '../utils/logger';

// TODO transform firebase errors

export interface ApiResponse<T> {
  items: T[];
  docs?: Document<T>[];
  query?: Query<T>;
  lastDoc?: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>;
}
export interface APIOptions {
  analyticsEvent?: AnalyticsEvent;
  cache?: CacheConfig;
  searchable?: {keywords: string[]};
}
export class Api {
  logger = LoggerFactory.getLogger(this.constructor.name);
  constructor() {}

  callAnalytics = (
    event: AnalyticsEvent,
    type: 'success' | 'error' = 'success',
    error?: Error,
  ) => {
    let params = {...event.params};
    if (error) {
      params.code = (error as any)?.code ?? error.message;
    }
    return Analytics.logEvent(event.name + '_' + type, params);
  };
}

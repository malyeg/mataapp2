import firestore from '@react-native-firebase/firestore';
import Config from 'react-native-config';
import {DataSearchable, Entity, QueryBuilder} from '../types/DataTypes';
import {APIOptions} from './Api';
import {DataApi} from './DataApi';
import itemsApi, {Item} from './itemsApi';

type DealStatus = 'new' | 'pre-approved' | 'canceled' | 'rejected' | 'finished';

export interface Deal extends DataSearchable, Entity {
  id: string;
  userId: string;
  item: Item;
  status: DealStatus;
}
class DealsApi extends DataApi<Deal> {
  constructor() {
    super(
      firestore().collection<Deal>(Config.SCHEMA_PREFIX + 'deals'),
      'items',
    );
  }

  createOffer = async (userId: string, item: Item) => {
    const deal: Omit<Deal, 'id'> = {
      item,
      userId,
      status: 'new',
    };
    const options: APIOptions = {
      cache: {
        evict: `${itemsApi.MY_ITEMS_CACHE_KEY}_${userId}`,
      },
    };
    return await this.add(deal, options);
  };

  getUserDeals = async (userId: string, item: Item) => {
    const query = new QueryBuilder<Deal>()
      .filter('userId', userId)
      .filter('item.id', item.id)
      .build();
    return await this.getAll(query, {
      cache: {
        enabled: true,
        key: `deals_${userId}_${item.id}`,
      },
    });
  };

  readonly DEALS_CACHE_KEY = 'deals';
}

const dealsApi = new DealsApi();

export default dealsApi;

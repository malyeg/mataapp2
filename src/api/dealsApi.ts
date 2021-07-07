import firestore from '@react-native-firebase/firestore';
import Config from 'react-native-config';
import {DataSearchable, Entity} from '../types/DataTypes';
import {APIOptions} from './Api';
import {DataApi} from './DataApi';
import {Item} from './itemsApi';

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

  createOffer = (userId: string, item: Item, options?: APIOptions) => {
    const deal: Omit<Deal, 'id'> = {
      item,
      userId,
      status: 'new',
    };
    return this.add(deal, options);
  };

  readonly DEALS_CACHE_KEY = 'deals';
}

const dealsApi = new DealsApi();

export default dealsApi;

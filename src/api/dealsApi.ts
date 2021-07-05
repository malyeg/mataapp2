import firestore from '@react-native-firebase/firestore';
import Config from 'react-native-config';
import {DataSearchable, Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';
import {Item} from './itemsApi';

type DealStatus = 'new' | 'pre-approved' | 'canceled' | 'rejected' | 'finished';

export interface Deal extends DataSearchable, Entity {
  id: string;
  userId: string;
  item: {
    id: string;
    name: string;
    ownerId: string;
    imageUrl: string;
  };
  status: DealStatus;
}
class DealsApi extends DataApi<Deal> {
  constructor() {
    super(
      firestore().collection<Deal>(Config.SCHEMA_PREFIX + 'deals'),
      'items',
    );
  }

  createOffer = (userId: string, item: Item) => {
    const deal: Omit<Deal, 'id'> = {
      item: {
        id: item.id,
        ownerId: item.userId,
        imageUrl: item.defaultImageURL ?? item.images![0]?.downloadURL!,
        name: item.name,
      },
      userId,
      status: 'new',
    };
    return this.add(deal);
  };

  readonly DEALS_CACHE_KEY = 'deals';
}

const dealsApi = new DealsApi();

export default dealsApi;

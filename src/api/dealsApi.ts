import {DataSearchable, Entity, QueryBuilder} from '../types/DataTypes';
import {APIOptions} from './Api';
import {DataApi} from './DataApi';
import itemsApi, {Item} from './itemsApi';

export type DealStatus =
  | 'new'
  | 'accepted'
  | 'canceled'
  | 'rejected'
  | 'finished';

export interface Deal extends DataSearchable, Entity {
  id: string;
  userId: string;
  item: Item;
  status: DealStatus;
  statusChanges?: {status: DealStatus; userId: string}[];
}
class DealsApi extends DataApi<Deal> {
  constructor() {
    super('deals');
  }

  createOffer = async (userId: string, item: Item) => {
    const deal: Omit<Deal, 'id'> = {
      item,
      userId,
      status: 'new',
    };
    const options: APIOptions = {
      cache: {
        evict: [`${itemsApi.MY_ITEMS_CACHE_KEY}_${userId}`, item.id],
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

  // TODO replace with FB function
  updateStatus = (deal: Deal, userId: string, status: DealStatus) => {
    const statusChange = {status, userId};
    const statusChanges = deal.statusChanges
      ? [...deal.statusChanges, statusChange]
      : [statusChange];
    return this.update(
      deal.id,
      {
        status,
        statusChanges,
      },
      {cache: {evict: deal.id}},
    );
  };

  readonly DEALS_CACHE_KEY = 'deals';
}

const dealsApi = new DealsApi();

export default dealsApi;

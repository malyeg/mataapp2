import {
  DataSearchable,
  Entity,
  Operation,
  QueryBuilder,
} from '../types/DataTypes';
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
  swapItem?: Item;
  status: DealStatus;
  statusChanges?: {status: DealStatus; userId: string}[];
}
class DealsApi extends DataApi<Deal> {
  constructor() {
    super('deals');
  }

  createOffer = async (userId: string, item: Item, swapItem?: Item) => {
    const deal: Omit<Deal, 'id'> = {
      item,
      userId,
      status: 'new',
    };
    if (swapItem) {
      deal.swapItem = swapItem;
    }
    const options: APIOptions = {
      cache: {
        evict: [`${itemsApi.MY_ITEMS_CACHE_KEY}_${userId}`, item.id],
      },
    };
    console.log('new deal', deal);
    return await this.add(deal, options);
  };

  getUserDeals = async (userId: string, item: Item) => {
    const query = new QueryBuilder<Deal>()
      .filters([
        {field: 'userId', value: userId},
        {field: 'item.id', value: item.id},
        {
          field: 'status',
          operation: Operation.IN,
          value: ['accepted', 'new'] as DealStatus[],
        },
      ])
      .build();
    return await this.getAll(query);
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

  acceptOffer = async (dealId: string) => {
    return await this.functions.httpsCallable('acceptOffer')({dealId});
  };

  rejectOffer = async (dealId: string, reason: string) => {
    return await this.functions.httpsCallable('rejectOffer')({dealId, reason});
  };

  cancelOffer = async (dealId: string, reason?: string) => {
    return await this.functions.httpsCallable('cancelOffer')({dealId, reason});
  };

  readonly DEALS_CACHE_KEY = 'deals';
}

const dealsApi = new DealsApi();

export default dealsApi;

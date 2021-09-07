import {User} from '../contexts/user-model';
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
  | 'closed';

export interface Deal extends DataSearchable, Entity {
  id: string;
  userId: string; //deprected
  user: {
    id: string;
    name: string;
    email: string;
    isProfilePublic?: boolean;
  };
  item: Item;
  swapItem?: Item;
  status: DealStatus;
  statusChanges?: {status: DealStatus; userId: string}[];
}
class DealsApi extends DataApi<Deal> {
  constructor() {
    super('deals');
  }

  createOffer = async (user: Deal['user'], item: Item, swapItem?: Item) => {
    const deal: Omit<Deal, 'id'> = {
      item,
      userId: user.id!,
      user,
      status: 'new',
    };
    if (swapItem) {
      deal.swapItem = swapItem;
    }
    const options: APIOptions = {
      cache: {
        evict: [`${itemsApi.MY_ITEMS_CACHE_KEY}_${user.id}`, item.id],
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

  itemHasDeals = async (userId: string, item: Item) => {
    const deals = await this.getUserDeals(userId, item);
    if (deals && deals.items.length > 0) {
      return true;
    }
    return false;
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

  cancelOffer = async (dealId: string, reason: string = 'other') => {
    console.log('dealId', dealId);
    return await this.functions.httpsCallable('cancelOffer')({dealId, reason});
  };
  closeOffer = async (dealId: string) => {
    // return this.closeOffer
    return await this.functions.httpsCallable('closeOffer')({dealId});
  };

  readonly DEALS_CACHE_KEY = 'deals';
}

const dealsApi = new DealsApi();

export default dealsApi;

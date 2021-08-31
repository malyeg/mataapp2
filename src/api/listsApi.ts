import {Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';

export interface ListItem extends Entity {
  id: string;
  type: 'wish' | 'favorite';
}

class ListsApi extends DataApi<ListItem> {
  constructor() {
    super('lists');
  }
}

const listsApi = new ListsApi();

export default listsApi;

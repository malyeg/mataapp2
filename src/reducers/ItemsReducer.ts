import {ApiResponse} from '../api/Api';
import {Item} from '../api/itemsApi';
import {Query} from '../types/DataTypes';

export type ItemsState = {
  itemsResponse: ApiResponse<Item>;
  loading?: boolean;
  query?: Query<Item>;
};

interface SetItemsAction {
  type: 'SET_ITEMS';
  itemsResponse: ApiResponse<Item>;
}
interface SetLoadingAction {
  type: 'SET_LOADING';
  loading: boolean;
}

interface SetQueryAction {
  type: 'SET_QUERY';
  query: Query<Item>;
}

export type ItemsActions = SetItemsAction | SetLoadingAction | SetQueryAction;

function ItemsReducer(draftState: ItemsState, action: ItemsActions) {
  switch (action.type) {
    case 'SET_ITEMS':
      draftState.itemsResponse = action.itemsResponse;
      draftState.loading = false;
      return draftState;
    case 'SET_LOADING':
      draftState.loading = action.loading;
      return draftState;
    case 'SET_QUERY':
      draftState.query = action.query;
      draftState.loading = true;
      return draftState;
    default:
      return draftState;
  }
}

export default ItemsReducer;

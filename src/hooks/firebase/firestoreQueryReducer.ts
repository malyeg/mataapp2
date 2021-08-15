import {ApiResponse} from '../../api/Api';
import {Document, Entity, Query} from '../../types/DataTypes';

export type DataState = {
  data?: Entity[];
  loading?: boolean;
  error?: Error;
  query?: Query<Entity>;
  lastDoc?: Document;
  currentPage?: number;
};

interface SetDataAction {
  type: 'SET_DATA';
  data: ApiResponse<Entity>;
}
interface SetLoadingAction {
  type: 'SET_LOADING';
  loading: boolean;
}

interface SetErrorAction {
  type: 'SET_ERROR';
  error: Error;
}

interface LoadMoreAction {
  type: 'LOAD_MORE';
}

export type StateActions =
  | SetDataAction
  | SetErrorAction
  | SetLoadingAction
  | LoadMoreAction;

function firestoreSnapshotReducer(draftState: DataState, action: StateActions) {
  switch (action.type) {
    case 'SET_DATA':
      draftState.data =
        !!draftState.data && draftState.data.length > 0
          ? [...draftState.data, ...action.data.items]
          : action.data.items;

      if (
        action.data.docs &&
        action.data.docs.length > 0 &&
        action.data.docs.length < draftState?.query?.limit!
      ) {
        draftState.lastDoc = action.data.docs[action.data.docs.length - 1];
        console.log('setting lst doc to ', draftState.lastDoc.data().name);
      } else {
        console.log('setting lst doc to undefined');
        draftState.lastDoc = undefined;
      }
      draftState.loading = false;
      return draftState;
    case 'SET_LOADING':
      draftState.loading = action.loading;
      return draftState;
    case 'SET_ERROR':
      draftState.error = action.error;
      draftState.loading = false;
      return draftState;
    case 'LOAD_MORE':
      if (draftState.lastDoc) {
        console.log('increment current page');
        draftState.currentPage = draftState.currentPage
          ? draftState.currentPage + 1
          : 1;
      } else {
        console.log('no lst doc found');
      }
      return draftState;
    default:
      return draftState;
  }
}

export default firestoreSnapshotReducer;

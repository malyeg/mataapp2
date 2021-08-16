import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Document, Entity, Query} from '../../types/DataTypes';

export type DataState = {
  data?: Entity[];
  loading?: boolean;
  error?: Error;
  query?: Query<Entity>;
  // lastDoc?: Document;
  currentPage?: number;
};

interface SetDocsAction {
  type: 'SET_DOCS';
  docs: FirebaseFirestoreTypes.QueryDocumentSnapshot<Entity>[];
}
interface SetLoadingAction {
  type: 'SET_LOADING';
  loading: boolean;
}

interface SetErrorAction {
  type: 'SET_ERROR';
  error: Error;
}

// interface NextPageAction {
//   type: 'NEXT_PAGE';
// }
interface UpdateQueryAction {
  type: 'UPDATE_QUERY';
  query: Query<Entity>;
}

export type StateActions =
  | SetDocsAction
  | SetErrorAction
  | SetLoadingAction
  // | NextPageAction
  | UpdateQueryAction;

function firestoreSnapshotReducer(draftState: DataState, action: StateActions) {
  switch (action.type) {
    case 'SET_DOCS':
      // draftState.data =
      //   !!draftState.data && draftState.data.length > 0
      //     ? [...draftState.data, ...action.docs.map(getDocData)]
      //     : action.docs.map(getDocData);
      draftState.data = action.docs.map(getDocData);
      // if (
      //   action.docs &&
      //   action.docs.length > 0 &&
      //   action.docs.length < draftState?.query?.limit!
      // ) {
      //   draftState.lastDoc = action.docs[action.docs.length - 1];
      //   console.log('setting lst doc to ', draftState.lastDoc.data().name);
      // } else {
      //   console.log('setting lst doc to undefined');
      //   draftState.lastDoc = undefined;
      // }
      draftState.loading = false;
      return draftState;
    case 'SET_LOADING':
      draftState.loading = action.loading;
      return draftState;
    case 'UPDATE_QUERY':
      draftState.data = undefined;
      // draftState.lastDoc = undefined;
      draftState.query = action.query;
      return draftState;
    case 'SET_ERROR':
      draftState.error = action.error;
      draftState.loading = false;
      return draftState;
    // case 'NEXT_PAGE':
    //   console.log('NEXT_PAGE reducer');
    //   if (draftState.lastDoc) {
    //     console.log('increment current page');
    //     draftState.currentPage = draftState.currentPage
    //       ? draftState.currentPage + 1
    //       : 1;
    //   } else {
    //     console.log('no lst doc found');
    //   }
    //   return draftState;
    default:
      return draftState;
  }
}

function getDocData(doc: Document<Entity>) {
  return {...doc.data(), id: doc.id};
}

export default firestoreSnapshotReducer;

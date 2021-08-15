import {useEffect} from 'react';
import {useImmerReducer} from 'use-immer';
import {DataApi} from '../api/DataApi';
import {DataCollection, Entity, Query} from '../types/DataTypes';
import firestoreSnapshotReducer, {
  DataState,
} from './firebase/FirestoreSnapshotReducer';

export function useFirestoreQuery<T extends Entity>(
  collection: DataCollection<T>,
  query?: Query<Entity>,
) {
  const [state, dispatch] = useImmerReducer(firestoreSnapshotReducer, {
    query,
  } as DataState);

  useEffect(() => {
    console.log('useFirestoreQuery useEffect', query);
    dispatch({
      type: 'SET_LOADING',
      loading: true,
    });

    let collectionQuery = query
      ? DataApi.fromQuery<Entity>({...query}, collection)
      : collection;

    if (state.lastDoc) {
      collectionQuery = collectionQuery.startAfter(state.lastDoc);
    }

    return collectionQuery.onSnapshot(
      snapshot => {
        const docs = snapshot.docs;
        console.log(
          'setting docs',
          docs.map(doc => ({id: doc.id, name: doc.data().name})),
        );

        dispatch({type: 'SET_DOCS', docs});
      },
      error => {
        dispatch({type: 'SET_ERROR', error});
      },
    );
  }, [state.currentPage]);

  const loadMore = () => {
    dispatch({type: 'NEXT_PAGE'});
  };

  return {...state, loadMore};
}
// Get doc data and merge doc.id
// function getDocData(doc: Document<Entity>) {
//   return doc.exists === true ? {...doc.data(), id: doc.id} : null;
// }
// Get array of doc data from collection
// function getCollectionData(collection: any) {
//   return collection.docs.map(getDocData);
// }

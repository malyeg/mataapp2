import {useEffect} from 'react';
import {useImmerReducer} from 'use-immer';
import {DataApi} from '../../api/DataApi';
import {Document, Entity, Query, QueryBuilder} from '../../types/DataTypes';
import firestoreSnapshotReducer, {DataState} from './FirestoreSnapshotReducer';

export function useFirestoreSnapshot<T extends Entity>({
  collectionName,
  query,
  docMapper,
}: {
  collectionName: string;
  query?: Query<T>;
  docMapper?: (doc: Document<T>) => T;
}) {
  const [state, dispatch] = useImmerReducer(firestoreSnapshotReducer, {
    query,
  } as DataState<T>);

  useEffect(() => {
    console.log('useFirestoreSnapshot useEffect', state.query);

    dispatch({
      type: 'SET_LOADING',
      loading: true,
    });

    const dataApi = new DataApi<T>(collectionName);
    let collectionQuery = state.query
      ? DataApi.fromQuery<T>({...state.query}, dataApi.collection)
      : dataApi.collection;

    // if (state.lastDoc) {
    //   collectionQuery = collectionQuery.startAfter(state.lastDoc);
    // }

    return collectionQuery.onSnapshot(
      snapshot => {
        console.log('useFirestoreSnapshot snapshot', snapshot.size);
        dispatch({type: 'SET_DOCS', docs: snapshot.docs, docMapper});
      },
      error => {
        console.log('useFirestoreQuery error', error);
        dispatch({type: 'SET_ERROR', error});
      },
    );
  }, [collectionName, dispatch, docMapper, state.query]);

  const updateQuery = (newQuery: Query<T>) => {
    if (!QueryBuilder.equal(newQuery, state.query)) {
      dispatch({type: 'UPDATE_QUERY', query: newQuery});
    } else {
      console.log('queries are equal');
    }
  };
  return {
    ...state,
    // loadMore,
    updateQuery,
  };
}

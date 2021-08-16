import {useEffect} from 'react';
import {useImmerReducer} from 'use-immer';
import {DataApi} from '../../api/DataApi';
import {Entity, Query, QueryBuilder} from '../../types/DataTypes';
import firestoreSnapshotReducer, {DataState} from './FirestoreSnapshotReducer';

export function useFirestoreSnapshot<T extends Entity>({
  collectionName,
  query,
}: {
  collectionName: string;
  query?: Query<T>;
}) {
  const [state, dispatch] = useImmerReducer(firestoreSnapshotReducer, {
    query,
  } as DataState);

  useEffect(() => {
    console.log('useFirestoreQuery useEffect', state.query);

    dispatch({
      type: 'SET_LOADING',
      loading: true,
    });

    const dataApi = new DataApi<T>(collectionName);
    let collectionQuery = state.query
      ? DataApi.fromQuery<Entity>({...state.query}, dataApi.collection)
      : dataApi.collection;

    // if (state.lastDoc) {
    //   collectionQuery = collectionQuery.startAfter(state.lastDoc);
    // }

    return collectionQuery.onSnapshot(
      snapshot => {
        dispatch({type: 'SET_DOCS', docs: snapshot.docs});
      },
      error => {
        dispatch({type: 'SET_ERROR', error});
      },
    );
  }, [collectionName, dispatch, state.query]);

  const loadMore = () => {
    dispatch({type: 'NEXT_PAGE'});
  };

  const updateQuery = (newQuery: Query<T>) => {
    if (!QueryBuilder.equal(newQuery, state.query)) {
      dispatch({type: 'UPDATE_QUERY', query: newQuery});
    } else {
      console.log('queries are equal');
    }
  };
  return {...state, loadMore, updateQuery};
}

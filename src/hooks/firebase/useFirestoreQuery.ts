import {useEffect} from 'react';
import {useImmerReducer} from 'use-immer';
import {DataApi} from '../../api/DataApi';
import {Entity, Query} from '../../types/DataTypes';
import firestoreQueryReducer, {DataState} from './firestoreQueryReducer';

export function useFirestoreQuery<T extends Entity>({
  collectionName,
  query,
}: {
  collectionName: string;
  query?: Query<T>;
}) {
  const [state, dispatch] = useImmerReducer(firestoreQueryReducer, {
    query,
  } as DataState);

  useEffect(() => {
    console.log('useFirestoreQuery useEffect', query);
    dispatch({
      type: 'SET_LOADING',
      loading: true,
    });
    const dataApi = new DataApi(collectionName);
    dataApi.getAll(query).then(data => {
      if (data) {
        dispatch({
          type: 'SET_DATA',
          data: data,
        });
      }
    });
  }, [collectionName, query]);

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

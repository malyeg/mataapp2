import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import itemsApi, {Item} from '../api/itemsApi';
import {Loader, Screen} from '../components/core';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import {useFirestoreSnapshot} from '../hooks/firebase/useFirestoreSnapshot';
import useAuth from '../hooks/useAuth';
import {QueryBuilder} from '../types/DataTypes';

export const MY_ITEMS_SCREEN = 'MyItemsScreen';
const MyItemsScreen = () => {
  const {user} = useAuth();
  const {data, loading} = useFirestoreSnapshot({
    collectionName: itemsApi.collectionName,
    query: QueryBuilder.from({
      filters: [{field: 'userId', value: user.id}],
    }),
  });

  const renderItem = useCallback(
    ({item}: any) => (
      <ItemCard style={styles.card} item={item as Item} showActivityStatus />
    ),
    [],
  );

  return (
    <Screen scrollable={false} style={styles.screen}>
      {!loading ? (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          showsVerticalScrollIndicator={false}
          data={{items: data}}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={2}
          renderItem={renderItem}
          itemSize={ITEM_CARD_HEIGHT}
        />
      ) : (
        <Loader />
      )}
    </Screen>
  );
};

export default React.memo(MyItemsScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  datalist: {flex: 1},
  categories: {
    marginVertical: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flexBasis: '48%',
  },
});

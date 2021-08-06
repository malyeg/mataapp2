import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ApiResponse} from '../api/Api';
import itemsApi, {Item} from '../api/itemsApi';
import {Loader, Screen} from '../components/core';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import useAuth from '../hooks/useAuth';
import {Filter, QueryBuilder} from '../types/DataTypes';

export const MY_ITEMS_SCREEN = 'MyItemsScreen';
const MyItemsScreen = () => {
  const {user} = useAuth();
  const [itemsResponse, setItemsResponse] = useState<ApiResponse<Item>>();

  useEffect(() => {
    const filters: Filter<Item>[] = [{field: 'userId', value: user.id}];
    let query = new QueryBuilder<Item>().filters(filters).limit(100).build();

    // itemsApi.getAll(query).then(items => {
    //   console.log('new myitems');
    //   setItemsResponse(items);
    // });
    const unsubscribe = itemsApi.onQuerySnapshot(
      snapshot => {
        console.log('new snapshot');
        setItemsResponse({items: snapshot.data});
      },
      error => console.error(error),
      query,
    );
    return () => {
      console.log('unsubscribe');
      unsubscribe();
    };
  }, [user.id]);

  const renderItem = useCallback(
    ({item}: any) => (
      <ItemCard style={styles.card} item={item as Item} showActivityStatus />
    ),
    [],
  );

  return (
    <Screen scrollable={false} style={styles.screen}>
      {itemsResponse ? (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          showsVerticalScrollIndicator={false}
          data={itemsResponse}
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

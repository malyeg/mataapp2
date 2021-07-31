import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import itemsApi, {Item} from '../api/itemsApi';
import {Loader, Screen} from '../components/core';
import ItemsFilter from '../components/widgets/data/ItemsFilter';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import {ItemsRouteProp} from '../navigation/DrawerStack';
import {Operation, Query, QueryBuilder} from '../types/DataTypes';

const ItemsScreen = () => {
  const route = useRoute<ItemsRouteProp>();
  const [query, setQuery] = useState<Query<Item>>();

  useEffect(() => {
    const getQuery = () => {
      // const {categoryId, userId, swapType, status, conditionType, city} =
      //   route.params;
      const builder = new QueryBuilder<Item>().limit(100);

      !!route.params?.categoryId &&
        builder.filter(
          'category.path',
          route.params?.categoryId,
          Operation.CONTAINS,
        );

      !!route.params?.swapType &&
        builder.filter('swapOption.type', route.params?.swapType);
      !!route.params?.status && builder.filter('status', route.params?.status);
      !!route.params?.conditionType &&
        builder.filter('condition.type', route.params?.conditionType);

      if (route.params?.userId) {
        builder.filter('userId', route.params?.userId);
        // TODO change title
      }
      if (route.params?.city) {
        builder.filter('location.city', route.params?.city);
        // TODO change title
      }
      const newQuery = builder.build();
      console.log('newQuery', newQuery);
      return newQuery;
    };
    setQuery(getQuery());
  }, [route.params]);

  const loadItems = useCallback(async () => {
    try {
      const response = await itemsApi.getAll(query);
      return response;
    } catch (error) {
      console.error(error);
    }
  }, [query]);

  const renderItem = useCallback(
    ({item}: any) => (
      <ItemCard style={styles.card} item={item as Item} showActivityStatus />
    ),
    [],
  );

  return (
    <Screen scrollable={false} style={styles.screen}>
      <View style={styles.header}>
        <ItemsFilter style={styles.filter} />
      </View>
      {query ? (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          showsVerticalScrollIndicator={false}
          data={loadItems}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={2}
          // pageable
          renderItem={renderItem}
          itemSize={ITEM_CARD_HEIGHT}
          // LoaderComponent={<Text>asdf</Text>}
        />
      ) : (
        <Loader />
      )}
      {/* {loader} */}
    </Screen>
  );
};

export default React.memo(ItemsScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
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
  filter: {
    marginLeft: 20,
  },
});

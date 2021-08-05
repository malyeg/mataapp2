import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ApiResponse} from '../api/Api';
import itemsApi, {Item, ItemStatus} from '../api/itemsApi';
import {Loader, Screen} from '../components/core';
import ItemsFilter from '../components/widgets/data/ItemsFilter';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import useApi from '../hooks/useApi';
import {ItemsRouteProp} from '../navigation/ItemsStack';
import {Filter, Operation, Query, QueryBuilder} from '../types/DataTypes';

const ItemsScreen = () => {
  const route = useRoute<ItemsRouteProp>();
  const initialQueryRef = useRef<Query<Item> | undefined>();
  const [query, setQuery] = useState<Query<Item>>();
  const [itemsResponse, setItemsResponse] = useState<ApiResponse<Item>>();
  const {loader} = useApi();

  useEffect(() => {
    const builder = new QueryBuilder<Item>().limit(100);
    builder.filter('status', 'online' as ItemStatus);

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
    initialQueryRef.current = newQuery;
    setQuery(newQuery);
  }, [route.params]);

  useEffect(() => {
    console.log('useEffect query', query);
    const unsubscribe = itemsApi.onQuerySnapshot(
      snapshot => {
        setItemsResponse({items: snapshot.data});
      },
      error => {
        console.error(error);
      },
      query,
    );

    return unsubscribe;
  }, [query]);

  const renderItem = useCallback(
    ({item}: any) => (
      <ItemCard style={styles.card} item={item as Item} showActivityStatus />
    ),
    [],
  );

  const onFilterChange = useCallback((filters?: Filter<Item>[]) => {
    console.log('onFilterChange', filters);
    if (filters && filters.length > 0) {
      const newFilters = initialQueryRef.current?.filters
        ? [...initialQueryRef.current?.filters, ...filters]
        : [...filters];
      const newQuery = QueryBuilder.from({...initialQueryRef.current}!)
        .filters(newFilters)
        .build();
      console.log('newQuery', newQuery);
      setQuery(newQuery);
      // setQuery(initialQueryRef.current);
    } else {
      // setQuery(initialQueryRef.current);
    }
  }, []);

  return (
    <Screen scrollable={false} style={styles.screen}>
      <View style={styles.header}>
        <ItemsFilter
          style={styles.filter}
          onChange={onFilterChange}
          filters={query?.filters}
        />
      </View>
      {query && itemsResponse ? (
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
      {loader}
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

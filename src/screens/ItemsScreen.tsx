import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import itemsApi, {Item} from '../api/itemsApi';
import {Loader, Screen, Text} from '../components/core';
import ItemsFilter from '../components/widgets/data/ItemsFilter';
import Sort from '../components/widgets/data/Sort';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import useLoader from '../hooks/useLoader';
import {ItemsRouteProp} from '../navigation/HomeStack';
import {Query, QueryBuilder, SortDirection} from '../types/DataTypes';

const ItemsScreen = () => {
  const route = useRoute<ItemsRouteProp>();
  // const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const {loader, loading, hideLoader} = useLoader(true);
  const [sort, setSort] = useState<SortDirection>();
  const [query, setQuery] = useState<Query<Item>>();

  useEffect(() => {
    const getQuery = () => {
      const categoryId = route.params?.categoryId;
      const builder = new QueryBuilder<Item>()
        // .filters(filters)
        // .orderBy('nameLC', 'asc')
        .orderBy('name', sort)
        .limit(100);
      if (categoryId) {
        // builder.filter('category.id', categoryId);
      }

      const newQuery = builder.build();
      return newQuery;
    };
    setQuery(getQuery());
  }, [route.params?.categoryId, sort]);

  const loadItems = useCallback(async () => {
    try {
      // const filters: Filter<Item>[] = [{field: 'userId', value: user.id}];

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

  const onSortChange = useCallback((value: SortDirection) => {
    console.log('value', value);
    setSort(value);
  }, []);

  return (
    <Screen scrollable={false} style={styles.screen}>
      <View style={styles.header}>
        <Sort onChange={onSortChange} />
        <ItemsFilter style={styles.filter} />
      </View>
      {query ? (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          // key={lastRefresh}
          showsVerticalScrollIndicator={false}
          data={loadItems}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={2}
          // pageable
          refreshable
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

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useImmerReducer} from 'use-immer';
import itemsApi, {Item, ItemStatus} from '../api/itemsApi';
import {Loader, Screen} from '../components/core';
import ItemsFilter from '../components/widgets/data/ItemsFilter';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import useLocation from '../hooks/useLocation';
import {ItemsRouteProp} from '../navigation/ItemsStack';
import ItemsReducer, {ItemsState} from '../reducers/ItemsReducer';
import {Filter, Operation, QueryBuilder} from '../types/DataTypes';

const ItemsScreen = () => {
  const navigation = useNavigation();
  const {location} = useLocation();
  const route = useRoute<ItemsRouteProp>();
  const [state, dispatch] = useImmerReducer(ItemsReducer, {
    loading: false,
  } as ItemsState);
  ø;
  const {itemsResponse, loading, query} = state;

  useEffect(() => {
    console.log('navigation state', navigation.getState());
    let newQuery;
    if (route.params) {
      const builder = new QueryBuilder<Item>();
      builder.filters([
        {
          field: 'status',
          value: 'online' as ItemStatus,
        },
        {
          field: 'location.city',
          value: location?.city,
        },
      ]);

      !!route.params?.categoryId &&
        builder.filter(
          'category.path',
          route.params?.categoryId,
          Operation.CONTAINS,
        );

      newQuery = builder.build();
      if (!QueryBuilder.equal(query, newQuery)) {
        dispatch({
          type: 'SET_QUERY',
          query: newQuery,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.city, route.params]);

  useEffect(() => {
    console.log('useEffect query');
    let unsubscribe;
    if (query) {
      unsubscribe = itemsApi.onQuerySnapshot(
        snapshot => {
          dispatch({
            type: 'SET_ITEMS',
            itemsResponse: {items: snapshot.data},
          });
        },
        error => {
          console.error(error);
        },
        query,
      );
    }
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const renderItem = ({item}: any) => (
    <ItemCard style={styles.card} item={item as Item} showActivityStatus />
  );

  const onFilterChange = useCallback((filters?: Filter<Item>[]) => {
    console.log('onFilterChange', filters);
    let newQuery;
    if (filters && filters.length > 0) {
      const newFilters = query?.filters
        ? [...query.filters, ...filters]
        : [...filters];
      newQuery = new QueryBuilder<Item>().filters(newFilters).build();
    } else {
      newQuery = new QueryBuilder<Item>().filters(query?.filters ?? []).build();
    }
    !QueryBuilder.equal(query, newQuery) &&
      dispatch({
        type: 'SET_QUERY',
        query: newQuery,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {!loading && !!itemsResponse ? (
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

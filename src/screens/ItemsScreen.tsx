import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import itemsApi, {Item, ItemStatus} from '../api/itemsApi';
import {Loader, Screen} from '../components/core';
import ItemsFilter from '../components/widgets/data/ItemsFilter';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import {screens} from '../config/constants';
import {useFirestoreSnapshot} from '../hooks/firebase/useFirestoreSnapshot';
import useLocation from '../hooks/useLocation';
import {StackParams} from '../navigation/HomeStack';
import {Filter, Operation, QueryBuilder} from '../types/DataTypes';

type ItemsRoute = RouteProp<StackParams, typeof screens.ITEMS>;
const ItemsScreen = () => {
  const {location} = useLocation();
  const route = useRoute<ItemsRoute>();
  const fixedQuery = useMemo(
    () =>
      QueryBuilder.from({
        filters: [
          {field: 'status', value: 'online' as ItemStatus},
          {field: 'location.city', value: location?.city},
        ],
        orderBy: [{field: 'timestamp', direction: 'asc'}],
        limit: 50,
      }),
    [location?.city],
  );
  const queryFromRoute = useMemo(() => {
    const builder = QueryBuilder.fromQuery(fixedQuery);
    !!route.params?.categoryId &&
      builder.filter(
        'category.path',
        route.params?.categoryId,
        Operation.CONTAINS,
      );
    return builder.build();
  }, [fixedQuery, route.params?.categoryId]);

  const {data, loading, query, updateQuery} = useFirestoreSnapshot({
    collectionName: itemsApi.collectionName,
    query: queryFromRoute,
  });

  const renderItem = ({item}: any) => (
    <ItemCard style={styles.card} item={item as Item} showActivityStatus />
  );

  const onFilterChange = useCallback((filters?: Filter<Item>[]) => {
    const newQuery = QueryBuilder.fromQuery(fixedQuery);
    !!filters && newQuery.addToFilters(filters);
    updateQuery(newQuery.build());
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
      {!loading && !!data ? (
        <DataList
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

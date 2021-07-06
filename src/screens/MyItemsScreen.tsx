import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {StyleSheet} from 'react-native';
import itemsApi, {Item} from '../api/itemsApi';
import {Screen} from '../components/core';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import useAuth from '../hooks/useAuth';
import useLoader from '../hooks/useLoader';
import {MyItemsRouteProp} from '../navigation/HomeStack';
import {Filter, QueryBuilder} from '../types/DataTypes';

export const MY_ITEMS_SCREEN = 'MyItemsScreen';
const MyItemsScreen = () => {
  const {user} = useAuth();
  const route = useRoute<MyItemsRouteProp>();
  const lastRefresh = useRef<number>();
  // const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const {loader, loading, hideLoader} = useLoader(true);

  useFocusEffect(() => {
    console.log('useFocusEffect');
    if (route.params?.lastRefresh) {
      console.log('useFocusEffect refresh');
      lastRefresh.current = route.params?.lastRefresh;
      // setLastRefresh(Date.now());
    }

    hideLoader();
  });

  const loadItems = useCallback(
    async () => {
      try {
        console.log('loadItems');
        const filters: Filter<Item>[] = [{field: 'userId', value: user.id}];
        let query = new QueryBuilder<Item>()
          .filters(filters)
          .limit(100)
          .build();
        const cacheEnabled = route.params?.lastRefresh === lastRefresh.current;
        console.log('cacheEnabled', route.params?.lastRefresh, cacheEnabled);
        const response = await itemsApi.getAll(query, {
          cache: {
            enabled: cacheEnabled,
            key: `${itemsApi.MY_ITEMS_CACHE_KEY}_${user.id}`,
          },
        });
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [route.params?.lastRefresh],
  );

  const renderItem = useCallback(
    ({item}: any) => (
      <ItemCard style={styles.card} item={item as Item} showActivityStatus />
    ),
    [],
  );

  return (
    <Screen scrollable={false} style={styles.screen}>
      {!loading && (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          // key={lastRefresh}
          showsVerticalScrollIndicator={false}
          itemsFunc={loadItems}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={2}
          // pageable
          refreshable
          renderItem={renderItem}
          itemSize={ITEM_CARD_HEIGHT}
        />
      )}
      {loader}
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

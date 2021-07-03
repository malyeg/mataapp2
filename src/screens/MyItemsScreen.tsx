import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Category} from '../api/categoriesApi';
import itemsApi, {Item} from '../api/itemsApi';
import {Screen} from '../components/core';
import CategoryList from '../components/widgets/CategoryList';
import DataList from '../components/widgets/DataList';
import ItemCard, {ITEM_CARD_HEIGHT} from '../components/widgets/ItemCard';
import useAuth from '../hooks/useAuth';
import useLoader from '../hooks/useLoader';
import {MyItemsRouteProp} from '../navigation/HomeStack';
import {Filter, Operation, QueryBuilder} from '../types/DataTypes';

export const MY_ITEMS_SCREEN = 'MyItemsScreen';
const MyItemsScreen = () => {
  const {user} = useAuth();
  const route = useRoute<MyItemsRouteProp>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const lastRefresh = useRef(new Date());
  const cache = useRef(true);
  const {loader, loading, hideLoader} = useLoader(true);

  useFocusEffect(() => {
    if (route.params?.refresh) {
      console.log('refreshing');
      lastRefresh.current = new Date();
      cache.current = false;
    }
    hideLoader();
  });

  const loadItems = useCallback(
    async () => {
      try {
        const filters: Filter<Item>[] = [{field: 'userId', value: user.id}];
        selectedCategory?.id &&
          selectedCategory?.id !== '0' &&
          filters.push({
            field: 'category.id',
            value: selectedCategory?.id,
            operation: Operation.EQUAL,
          });
        let query = new QueryBuilder<Item>()
          .filters(filters)
          .limit(100)
          // .after(lastDoc)
          .build();
        console.log('cache.current', cache.current);
        const response = await itemsApi.getAll(query, {
          cache: {enabled: cache.current, key: itemsApi.MY_ITEMS_CACHE_KEY},
        });
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCategory, lastRefresh, cache.current],
  );

  // const onSelectCategory = useCallback(
  //   (category: Category) => {
  //     if (category?.id === '0') {
  //       setSelectedCategory(undefined);
  //     } else {
  //       setSelectedCategory(category);
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [setSelectedCategory, lastRefresh],
  // );

  const renderItem = useCallback(
    ({item}: any) => (
      <ItemCard style={styles.card} item={item as Item} showActivityStatus />
    ),
    [],
  );

  return (
    <Screen scrollable={false} style={styles.screen}>
      {/* <CategoryList
        horizontal
        onChange={onSelectCategory}
        style={styles.categories}
      /> */}
      {!loading && (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          key={lastRefresh.current.getTime()}
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

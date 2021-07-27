import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {ApiResponse} from '../../api/Api';
import categoriesApi from '../../api/categoriesApi';
import itemsApi, {Item, ItemStatus} from '../../api/itemsApi';
import {screens} from '../../config/constants';
import useAuth from '../../hooks/useAuth';
import useLocale from '../../hooks/useLocale';
import theme from '../../styles/theme';
import {Location, Operation, QueryBuilder} from '../../types/DataTypes';
import {Loader, Text} from '../core';
import DataList from './DataList';
import NoDataFound from './NoDataFound';
import RecommendedCard, {RecommendedCardSkeleton} from './RecommendedCard';

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
const ITEM_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface RecommendedItemsProps {
  location: Location;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

// const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const RecommendedItems = ({location, title, style}: RecommendedItemsProps) => {
  const navigation = useNavigation();
  const {profile} = useAuth();
  const [itemsResponse, setItemsResponse] = useState<ApiResponse<Item>>();

  const {t} = useLocale('widgets');

  useEffect(() => {
    const targetCategories = profile?.targetCategories;
    const query = new QueryBuilder<Item>()
      .filters([
        {field: 'location.city', value: location?.city!},
        {field: 'status', value: 'online' as ItemStatus},
        {
          field: 'category.id',
          operation: Operation.IN,
          value: targetCategories,
        },
      ])
      .limit(10)
      .build();

    const unsubscribe = itemsApi.onQuerySnapshot(
      snapshot => {
        setItemsResponse({items: snapshot.data});
      },
      error => {
        console.log(error);
      },
      query,
    );

    return unsubscribe;
  }, [location?.city, profile?.targetCategories]);

  const listEmptyComponent = (
    <NoDataFound body={'no items found in ' + location.city} icon="" />
  );

  const renderItem = useCallback(
    ({item}) => <RecommendedCard showSwapIcon item={item as Item} />,
    [],
  );
  const onEndReached = (info: any, length: number) => {
    if (length > 20) {
      navigation.navigate(screens.ITEMS);
    }
  };

  return itemsResponse ? (
    // return false ? (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title ??
            t('recommendedItems.title', {params: {city: location?.city!}})}
        </Text>
      </View>
      <DataList
        loaderStyle={styles.dataListHeight}
        refreshing={false}
        onRefresh={undefined}
        horizontal
        data={itemsResponse!}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        itemSize={ITEM_HEIGHT}
        onEndReached={onEndReached}
      />
    </View>
  ) : null;
};

export default React.memo(RecommendedItems);

const styles = StyleSheet.create({
  container: {},
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  dataListHeight: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.bold,
  },
  itemsLink: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
  },
  flatList: {
    flexGrow: 0,
  },
  card: {
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: 150,
    height: 200,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 6,
  },
  eyeIcon: {
    paddingRight: 5,
  },
  pressableContainer: {
    flex: 3,
    marginBottom: 5,
  },
  image: {
    flex: 1,
  },
  cardCategory: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    width: '100%',
    borderTopColor: theme.colors.lightGrey,
    borderTopWidth: 2,
  },
  listActivityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  anotherAreaLink: {
    textDecorationLine: 'underline',
  },
});

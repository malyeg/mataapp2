import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ApiResponse} from '../../api/Api';
import itemsApi, {Item, ItemStatus} from '../../api/itemsApi';
import {screens} from '../../config/constants';
import useAuth from '../../hooks/useAuth';
import useLocale from '../../hooks/useLocale';
import theme from '../../styles/theme';
import {Filter, Location, Operation, QueryBuilder} from '../../types/DataTypes';
import {Text} from '../core';
import DataList from './DataList';
import ItemCard from './ItemCard';
import NoDataFound from './NoDataFound';

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
const ITEM_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface NearByItemsProps {
  // items: Item[];
  // city: string;
  location: Location;
  // lastRefresh?: Date;
  title?: string;
  style?: StyleProp<ViewStyle>;
}
const NearByItems = ({location, title, style}: NearByItemsProps) => {
  const navigation = useNavigation<DrawerNavigationHelpers>();
  const {user} = useAuth();
  const [itemsResponse, setItemsResponse] = useState<ApiResponse<Item>>();

  const {t} = useLocale('widgets');

  useEffect(() => {
    // const targetCategories = profile?.targetCategories;
    const filters: Filter<Item>[] = [
      {field: 'location.city', value: location?.city!},
      {field: 'status', value: 'online' as ItemStatus},
      {field: 'userId', value: user.id, operation: Operation.NOT_EQUAL},
    ];
    const query = new QueryBuilder<Item>().filters(filters).limit(20).build();
    const unsubscribe = itemsApi.onQuerySnapshot(
      snapshot => {
        console.log('setting nearby items');
        setItemsResponse({items: snapshot.data ?? []});
      },
      error => {
        console.log(error);
      },
      query,
    );

    return unsubscribe;
  }, [location?.city, user.id]);

  const listEmptyComponent = (
    <NoDataFound
      body={'no items found in ' + location.city}
      icon=""
      style={styles.noData}>
      {/* <Link to={{screen: screens.ITEMS}}>{title ?? t('try another area')}</Link> */}
    </NoDataFound>
  );

  // const onSwap = useCallback():

  const renderItem = useCallback(
    ({item}) => <ItemCard showSwapIcon item={item as Item} />,
    [],
  );
  const onEndReached = (info: any, length: number) => {
    if (length > 20) {
      navigation.navigate(screens.ITEMS);
    }
  };

  return itemsResponse ? (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title ?? t('nearByItems.title', {params: {city: location?.city!}})}
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

export default React.memo(NearByItems);

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
  card: {
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: 150,
    height: 200,
    padding: 10,
  },
  noData: {
    flex: 1,
    // backgroundColor: 'grey',
  },
});

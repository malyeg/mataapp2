import {useRoute} from '@react-navigation/core';
import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ApiResponse} from '../api/Api';
import dealsApi, {Deal} from '../api/dealsApi';
import itemsApi from '../api/itemsApi';
import {Image, Loader, Screen, Text} from '../components/core';
import Card from '../components/core/Card';
import DataList from '../components/widgets/DataList';
import DealStatus from '../components/widgets/DealStatus';
import {patterns, screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useNavigationHelper from '../hooks/useNavigationHelper';
import {IngoingDealsRoute} from '../navigation/DealsTabs';
import theme from '../styles/theme';
import {Filter, Operation, QueryBuilder} from '../types/DataTypes';

const IncomingDealsScreen = () => {
  const [deals, setDeals] = useState<ApiResponse<Deal>>();
  const {loader} = useApi();
  const {user} = useAuth();
  const {navigation} = useNavigationHelper();
  const route = useRoute<IngoingDealsRoute>();

  useEffect(() => {
    const filters: Filter<Deal>[] = [{field: 'item.userId', value: user.id}];
    if (route?.params?.archived) {
      filters.push({
        field: 'status',
        operation: Operation.IN,
        value: ['closed', 'rejected', 'canceled'],
      });
    } else {
      filters.push({
        field: 'status',
        operation: Operation.IN,
        value: ['new', 'accepted'],
      });
    }
    const query = new QueryBuilder<Deal>()
      .filters(filters)
      .orderBy('timestamp', 'desc')
      .build();
    return dealsApi.onQuerySnapshot(
      snapshot => {
        setDeals({items: snapshot.data});
      },
      error => {
        console.error(error);
      },
      query,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const renderItem = ({item}: any) => <ItemDealCard deal={item} />;
  const renderItem = ({item}: {item: Deal}) => (
    <Card
      onPress={() => navigation.navigate(screens.DEAL_DETAILS, {id: item.id})}>
      <Image
        uri={itemsApi.getImageUrl(item.item)}
        style={[styles.image]}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text>{item.item?.category.name}</Text>
        {/* <Text>{item.item?.swapOption.type}</Text> */}
        {!!item.timestamp && (
          <Text style={styles.date}>
            {format(item.timestamp, patterns.DATE)}
          </Text>
        )}
        <DealStatus deal={item} style={styles.dealStatusText} />
      </View>
    </Card>
  );

  return (
    <Screen style={styles.screen}>
      {deals ? (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          showsVerticalScrollIndicator={false}
          data={deals}
          // columnWrapperStyle={styles.columnWrapper}
          renderItem={renderItem}
          // itemSize={ITEM_CARD_HEIGHT}
        />
      ) : (
        <Loader />
      )}
      {loader}
    </Screen>
  );
};

export default IncomingDealsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  datalist: {flex: 1},
  separator: {
    height: 15,
  },
  image: {
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  content: {
    marginLeft: 10,
    // flexDirection: 'row',
  },
  date: {
    color: theme.colors.grey,
    ...theme.styles.scale.body2,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealStatusText: {
    marginRight: 'auto',
    textTransform: 'capitalize',
    minWidth: 100,
    textAlign: 'center',
    // right: 0,
  },
});

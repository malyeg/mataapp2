import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ApiResponse} from '../api/Api';
import dealsApi, {Deal} from '../api/dealsApi';
import itemsApi from '../api/itemsApi';
import {Image, Loader, Screen, Text} from '../components/core';
import Card from '../components/core/Card';
import DataList from '../components/widgets/DataList';
import {patterns, screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useNavigationHelper from '../hooks/useNavigationHelper';
import theme from '../styles/theme';
import {QueryBuilder} from '../types/DataTypes';

const OutgoingDealsScreen = () => {
  const [deals, setDeals] = useState<ApiResponse<Deal>>();
  const {navigation} = useNavigationHelper();
  const {loader} = useApi();
  const {user} = useAuth();

  useEffect(() => {
    // const filter = QueryBuilder.filterFrom('userId', user.id);
    const query = new QueryBuilder<Deal>()
      .filters([
        {field: 'userId', value: user.id},
        // {field: 'status', operation: Operation.IN, value: ['new', 'accepted']},
      ])
      .orderBy('timestamp', 'desc')
      .build();
    const unsubscribe = dealsApi.onQuerySnapshot(
      snapshot => {
        setDeals({items: snapshot.data});
      },
      error => {
        console.error(error);
      },
      query,
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({item}: {item: Deal}) => (
    <Card
      onPress={() => navigation.navigate(screens.DEAL_DETAILS, {id: item.id})}>
      {/* <View style={styles.dealStatus}>
        <DealStatus deal={item} />
      </View> */}
      <Image
        uri={itemsApi.getImageUrl(item.item)}
        style={[styles.image]}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text>{item.item?.category.name}</Text>

        {!!item.timestamp && (
          <Text style={styles.date}>
            {format(item.timestamp, patterns.DATE)}
          </Text>
        )}
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
          renderItem={renderItem}
        />
      ) : (
        <Loader />
      )}
      {loader}
    </Screen>
  );
};

export default OutgoingDealsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  dealStatus: {
    position: 'absolute',
    // marginLeft: 'auto',
    top: 0,
    right: 10,
    // bottom: 0,
  },
  datalist: {flex: 1},
  separator: {
    height: 15,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    // position: 'absolute',
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
  },
});

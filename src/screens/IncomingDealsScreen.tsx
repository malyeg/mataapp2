import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ApiResponse} from '../api/Api';
import dealsApi, {Deal} from '../api/dealsApi';
import {Loader, Screen} from '../components/core';
import DataList from '../components/widgets/DataList';
import DealCard from '../components/widgets/DealCard';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import {QueryBuilder} from '../types/DataTypes';

const IncomingDealsScreen = () => {
  const [deals, setDeals] = useState<ApiResponse<Deal>>();
  const {loader} = useApi();
  const {user} = useAuth();

  useEffect(() => {
    const filter = QueryBuilder.filterFrom('item.userId', user.id);
    const query = new QueryBuilder<Deal>()
      .filters([filter])
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

  const renderItem = ({item}: any) => <DealCard deal={item} />;

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
});

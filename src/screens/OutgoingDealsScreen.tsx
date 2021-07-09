import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ApiResponse} from '../api/Api';
import dealsApi, {Deal} from '../api/dealsApi';
import {Loader, Screen} from '../components/core';
import DealCard from '../components/widgets/DealCard';
import NoDataFound from '../components/widgets/NoDataFound';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import {QueryBuilder} from '../types/DataTypes';

const OutgoingDealsScreen = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const {request, loading} = useApi();
  const {user} = useAuth();
  useEffect(() => {
    const loadData = async () => {
      const filter = QueryBuilder.filterFrom('userId', user.id);
      const query = QueryBuilder.queryFrom<Deal>([filter]);
      const dealsResponse = await request<ApiResponse<Deal>>(() =>
        dealsApi.getAll(query),
      );
      if (dealsResponse) {
        setDeals(dealsResponse.items);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _renderItem = useCallback(
    ({item}: any) => <DealCard deal={item} />,
    [],
  );
  const itemSeparator = () => <View style={styles.separator} />;

  return !loading ? (
    <Screen style={styles.screen}>
      <FlatList
        data={deals}
        renderItem={_renderItem}
        ItemSeparatorComponent={itemSeparator}
        ListEmptyComponent={NoDataFound}
      />
    </Screen>
  ) : (
    <Loader />
  );
};

export default OutgoingDealsScreen;

const styles = StyleSheet.create({
  screen: {
    paddingTop: 20,
  },
  separator: {
    height: 15,
  },
});

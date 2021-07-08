import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import dealsApi, {Deal} from '../api/dealsApi';
import {Image, Loader, Screen, Text} from '../components/core';
import {format} from 'date-fns';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import {DealDetailsRouteProp} from '../navigation/HomeStack';
import theme from '../styles/theme';
import Chat from '../components/widgets/Chat';

const DealDetailsScreen = () => {
  const route = useRoute<DealDetailsRouteProp>();
  const navigation = useNavigation();
  const {request} = useApi();
  const [deal, setDeal] = useState<Deal>();
  useEffect(() => {
    const loadData = async () => {
      if (route.params?.id) {
        const freshDeal = await request<Deal>(() =>
          dealsApi.getById(route.params?.id!),
        );
        if (freshDeal) {
          setDeal(freshDeal);
          return;
        }
      }
      navigation.navigate(screens.DEALS_TABS);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route.params]);
  return deal ? (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Image uri={deal.item.defaultImageURL!} style={styles.image} />
        <View>
          <Text>{deal.item?.category?.name}</Text>
          <Text>{deal.item?.name}</Text>
          <Text>{deal.item?.swapOption?.type}</Text>
        </View>
      </View>
      <Chat dealId={deal.id} />
    </Screen>
  ) : (
    <Loader />
  );
};

export default DealDetailsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: -20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  date: {
    color: theme.colors.grey,
  },
});

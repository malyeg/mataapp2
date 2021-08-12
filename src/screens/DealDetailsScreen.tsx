import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import dealsApi, {Deal, DealStatus} from '../api/dealsApi';
import {Loader, Screen} from '../components/core';
import Chat from '../components/widgets/Chat';
import DealCard from '../components/widgets/DealCard';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import {StackParams} from '../navigation/HomeStack';
import theme from '../styles/theme';

type DealDetailsRoute = RouteProp<StackParams, typeof screens.DEAL_DETAILS>;
const DealDetailsScreen = () => {
  const route = useRoute<DealDetailsRoute>();
  const navigation = useNavigation<StackNavigationHelpers>();
  const {request, loader} = useApi();
  const {user} = useAuth();
  const [deal, setDeal] = useState<Deal>();
  useEffect(() => {
    const loadData = async () => {
      if (route.params?.id) {
        const freshDeal = await request<Deal>(() =>
          dealsApi.getById(route.params?.id!, {
            cache: {enabled: false},
          }),
        );
        console.log('freshDeal', freshDeal);
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

  // const acceptHandler = useCallback(async () => {
  //   console.log('acceptHandler');
  //   await request<Deal>(() =>
  //     dealsApi.updateStatus(deal!, user.id, 'accepted'),
  //   );
  //   setDeal(d => {
  //     return {...d, status: 'accepted'} as Deal;
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // const rejectHandler = useCallback(async () => {
  //   const status: DealStatus = 'rejected';
  //   await request<Deal>(() => dealsApi.updateStatus(deal!, user.id, status));
  //   setDeal(d => {
  //     return {...d, status} as Deal;
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // const finishHandler = useCallback(async () => {
  //   const status: DealStatus = 'finished';
  //   await request<Deal>(() => dealsApi.updateStatus(deal!, user.id, status));
  //   setDeal(d => {
  //     return {...d, status} as Deal;
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const isOpen =
    !!deal && (deal.status === 'new' || deal.status === 'accepted');

  const onHeaderPress = useCallback(() => {
    navigation.navigate(screens.ITEM_DETAILS, {
      id: deal?.item.id,
    });
  }, [deal?.item.id, navigation]);
  return deal ? (
    <Screen style={styles.screen}>
      <DealCard deal={deal} onPress={() => null} />

      <Chat deal={deal} disableComposer={!isOpen} />
      {loader}
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
  categoryName: {
    color: theme.colors.grey,
  },
  typeContainer: {
    flexDirection: 'row',
  },
  actionContainer: {
    // flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 20,
  },
  swapIcon: {
    // width: 40,
    // marginRight: 5,
    borderWidth: 0,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  date: {
    color: theme.colors.grey,
  },
});

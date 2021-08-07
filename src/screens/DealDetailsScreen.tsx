import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import dealsApi, {Deal, DealStatus} from '../api/dealsApi';
import {Image, Loader, Screen, Text} from '../components/core';
import Chat from '../components/widgets/Chat';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import {DealDetailsRouteProp} from '../navigation/DealsStack';
import theme from '../styles/theme';

const DealDetailsScreen = () => {
  const route = useRoute<DealDetailsRouteProp>();
  const navigation = useNavigation<StackNavigationHelpers>();
  const {request, loader} = useApi();
  const {user} = useAuth();
  const [deal, setDeal] = useState<Deal>();
  useEffect(() => {
    const loadData = async () => {
      if (route.params?.id) {
        const freshDeal = await request<Deal>(() =>
          dealsApi.getById(route.params?.id!, {
            cache: {enabled: true},
          }),
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

  const acceptHandler = useCallback(async () => {
    console.log('acceptHandler');
    await request<Deal>(() =>
      dealsApi.updateStatus(deal!, user.id, 'accepted'),
    );
    setDeal(d => {
      return {...d, status: 'accepted'} as Deal;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const rejectHandler = useCallback(async () => {
    const status: DealStatus = 'rejected';
    await request<Deal>(() => dealsApi.updateStatus(deal!, user.id, status));
    setDeal(d => {
      return {...d, status} as Deal;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const finishHandler = useCallback(async () => {
    const status: DealStatus = 'finished';
    await request<Deal>(() => dealsApi.updateStatus(deal!, user.id, status));
    setDeal(d => {
      return {...d, status} as Deal;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOpen =
    !!deal && (deal.status === 'new' || deal.status === 'accepted');

  const onHeaderPress = useCallback(() => {
    navigation.navigate(screens.ITEM_DETAILS, {
      id: deal?.item.id,
      fromScreen: screens.DEAL_DETAILS,
    });
  }, [deal?.item.id, navigation]);
  return deal ? (
    <Screen style={styles.screen}>
      <Pressable style={styles.header} onPress={onHeaderPress}>
        <Image uri={deal.item.defaultImageURL!} style={styles.image} />
        <View>
          <Text style={styles.categoryName}>{deal.item?.category?.name}</Text>
          <Text>{deal.item?.name}</Text>
          {/* <View style={styles.typeContainer}>
            <SwapIcon style={styles.swapIcon} />
            <Text>{deal.item?.swapOption?.type}</Text>
          </View> */}
        </View>
      </Pressable>
      {/* {isOpen &&
        (deal.userId === user.id ? (
          <View />
        ) : (
          <View style={styles.actionContainer}>
            {deal.status === 'new' && (
              <Button
                title="Accept"
                style={styles.actionButton}
                onPress={acceptHandler}
              />
            )}

            <Button
              title="Reject"
              style={styles.actionButton}
              onPress={rejectHandler}
            />
            {deal.status === 'accepted' && (
              <Button
                title="Finish deal"
                style={styles.actionButton}
                onPress={finishHandler}
              />
            )}
          </View>
        ))} */}
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
    borderRadius: 40,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  date: {
    color: theme.colors.grey,
  },
});

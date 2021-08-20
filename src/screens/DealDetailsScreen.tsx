import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Pressable, StyleSheet, View} from 'react-native';
import dealsApi, {Deal} from '../api/dealsApi';
import itemsApi from '../api/itemsApi';
import {Button, Icon, Image, Loader, Screen, Text} from '../components/core';
import Chat from '../components/widgets/Chat';
import Header from '../components/widgets/Header';
import Sheet from '../components/widgets/Sheet';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import useSheet from '../hooks/useSheet';
import {StackParams} from '../navigation/HomeStack';
import theme from '../styles/theme';

type DealDetailsRoute = RouteProp<StackParams, typeof screens.DEAL_DETAILS>;
const DealDetailsScreen = () => {
  const route = useRoute<DealDetailsRoute>();
  const navigation = useNavigation<StackNavigationHelpers>();
  const {request, loader} = useApi();
  const {user} = useAuth();
  const [deal, setDeal] = useState<Deal>();
  const {t} = useLocale('dealDetailsScreen');
  const {show, sheetRef} = useSheet();

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
          return freshDeal;
        }
      } else {
        navigation.navigate(screens.DEALS_TABS);
      }
    };
    loadData().then(d => {
      if (d) {
        const menuItems = [
          {
            label: t('menu.cancelLabel'),
            icon: {name: 'close-circle-outline', color: theme.colors.dark},
            onPress: () => {
              show({
                header: t('cancelOfferConfirmationHeader'),
                body: t('cancelOfferConfirmationBody'),
                cancelCallback: () => console.log('canceling'),
                confirmCallback: () =>
                  dealsApi.cancelOffer(d.id).then(() => {
                    navigation.navigate(screens.DEALS_TABS);
                  }),
              });
            },
          },
        ];
        navigation.setOptions({
          header: (props: any) => (
            <Header {...props} menu={{items: menuItems}} />
          ),
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route.params]);

  const acceptHandler = useCallback(async () => {
    // console.log('acceptHandler');
    const response = await dealsApi.acceptOffer(deal?.id!);
    console.log(response);
  }, [deal?.id]);
  const rejectHandler = useCallback(async () => {
    // TODO show rejection reason modal
    console.log('reject handler');
    const data = await dealsApi.rejectOffer(deal?.id!, 'other');
    console.log('reject data', data);
  }, [deal?.id]);

  const isOpen =
    !!deal && (deal.status === 'new' || deal.status === 'accepted');

  const onSwapItemPress = useCallback(() => {
    navigation.navigate(screens.ITEM_DETAILS, {
      id: deal?.userId === user.id ? deal?.item?.id : deal?.swapItem?.id,
    });
  }, [deal, navigation, user.id]);

  const imageUrl = deal?.item ? itemsApi.getImageUrl(deal?.item) : undefined;
  const swapImageUrl = deal?.swapItem
    ? itemsApi.getImageUrl(deal.swapItem)
    : undefined;
  return deal ? (
    <Screen style={styles.screen}>
      {/* <DealCard deal={deal} onPress={() => null} /> */}
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            uri={deal.userId !== user.id ? imageUrl : swapImageUrl}
            style={styles.image}
          />
        </View>
        <View style={styles.iconContainer}>
          <Icon name="swap" type="svg" size={20} color={theme.colors.white} />
        </View>
        <Pressable style={styles.swapImageContainer} onPress={onSwapItemPress}>
          <Image
            uri={deal.userId === user.id ? imageUrl : swapImageUrl}
            style={styles.swapImage}
            resizeMode="stretch"
          />
        </Pressable>
      </View>

      <Text style={styles.chatHeaderText}>
        {t('chatHeader', {
          params: {
            userName:
              deal.item?.user?.name ?? deal.item?.user?.email ?? 'Guest',
          },
        })}
      </Text>

      <Chat deal={deal} disableComposer={!isOpen} style={styles.chat} />
      {deal.userId !== user.id && (
        <>
          <Button
            title={t('approveBtnTitle')}
            onPress={acceptHandler}
            style={styles.acceptButton}
          />
          <Button
            title={t('rejectBtnTitle')}
            onPress={rejectHandler}
            themeType="white"
          />
        </>
      )}
      {loader}
      <Sheet ref={sheetRef} />
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
  chat: {
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.4,
        shadowRadius: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.white,
      },
      android: {
        elevation: 2,
      },
    }),
    marginBottom: 10,
  },
  chatHeaderText: {
    textAlign: 'center',
    marginBottom: 10,
    ...theme.styles.scale.h6,
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
  iconContainer: {
    backgroundColor: theme.colors.salmon,
    padding: 10,
    borderRadius: 20,
    marginHorizontal: -7,
    zIndex: 1000,
  },
  swapIcon: {
    borderWidth: 0,
  },
  swapImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.salmon,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.grey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  swapImage: {
    width: 100,
    height: 100,
    // borderColor: theme.colors.salmon,
    borderRadius: 10,
  },
  date: {
    color: theme.colors.grey,
  },
  acceptButton: {
    marginBottom: 10,
  },
});

import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import dealsApi, {Deal} from '../api/dealsApi';
import itemsApi from '../api/itemsApi';
import {Button, Icon, Image, Loader, Screen, Text} from '../components/core';
import Card from '../components/core/Card';
import Date from '../components/core/Date';
import SwapIcon from '../components/icons/SwapIcon';
import Chat from '../components/widgets/Chat';
import Header, {MenuItem} from '../components/widgets/Header';
import Sheet from '../components/widgets/Sheet';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import useSheet from '../hooks/useSheet';
import {StackParams} from '../navigation/HomeStack';
import sharedStyles from '../styles/SharedStyles';
import theme from '../styles/theme';

type DealDetailsRoute = RouteProp<StackParams, typeof screens.DEAL_DETAILS>;
const swapImageSize = 150;
const imageSize = 80;
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
        if (freshDeal) {
          setDeal(freshDeal);
          return freshDeal;
        }
      } else {
        navigation.navigate(screens.DEALS_TABS);
      }
    };
    loadData().then(d => {
      if (!d) {
        return;
      }
      let menuItems: MenuItem[] = [];
      const title = user.id === d.userId ? 'Outgoing deal' : 'Incoming deal';
      if (d.status === 'accepted' || d.status === 'new') {
        menuItems = [
          {
            label: t('menu.cancelLabel'),
            icon: {name: 'close-circle-outline', color: theme.colors.dark},
            onPress: () => {
              show({
                header: t('cancelOfferConfirmationHeader'),
                body: t('cancelOfferConfirmationBody'),
                cancelCallback: () => console.log('canceling'),
                confirmCallback: () => {
                  console.log(d.id);
                  dealsApi.cancelOffer(d.id).then(
                    () => {
                      navigation.navigate(screens.DEALS_TABS);
                    },
                    error => console.log(error),
                  );
                },
              });
            },
          },
        ];
      }
      (navigation as any).setOptions({
        header: (props: any) => (
          <Header {...props} title={title} menu={{items: menuItems}} />
        ),
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route.params]);

  const acceptHandler = async () => {
    await request(() => dealsApi.acceptOffer(deal?.id!));
    setDeal({...deal!, status: 'accepted'});
  };
  const rejectHandler = async () => {
    // TODO show rejection reason modal
    await request(() => dealsApi.rejectOffer(deal?.id!, 'other'));
    navigation.navigate(screens.DEALS_TABS);
  };
  const closeHandler = async () => {
    await request(() => dealsApi.closeOffer(deal?.id!));
    navigation.navigate(screens.DEALS_TABS);
  };

  const isOpen =
    !!deal && (deal.status === 'new' || deal.status === 'accepted');

  const onSwapItemPress = useCallback(() => {
    navigation.navigate(screens.ITEM_DETAILS, {
      id: deal?.swapItem?.id,
    });
  }, [deal, navigation]);
  const onItemPress = useCallback(() => {
    navigation.navigate(screens.ITEM_DETAILS, {
      id: deal?.item?.id,
    });
  }, [deal, navigation]);

  const imageUrl = deal?.item ? itemsApi.getImageUrl(deal?.item) : undefined;
  const swapImageUrl = deal?.swapItem
    ? itemsApi.getImageUrl(deal.swapItem)
    : undefined;
  return deal ? (
    <Screen style={styles.screen}>
      <Card style={styles.card}>
        <Text
          style={[
            styles.statusText,
            deal.status === 'accepted' ? sharedStyles.greenBtn : {},
            deal.status === 'new' ? {backgroundColor: theme.colors.orange} : {},
            deal.status === 'closed'
              ? {backgroundColor: theme.colors.dark}
              : {},
          ]}>
          {deal.status}
        </Text>
        <Date date={deal.timestamp!} style={styles.dealDateText} />
        <Pressable style={styles.imageContainer} onPress={onItemPress}>
          <Image
            uri={imageUrl}
            style={
              deal.item.swapOption.type !== 'free'
                ? styles.image
                : styles.swapImage
            }
          />
        </Pressable>
        {deal.item.swapOption.type !== 'free' && deal.swapItem && (
          <>
            <SwapIcon style={styles.swapIcon} />
            <Pressable
              style={styles.swapImageContainer}
              onPress={onSwapItemPress}>
              <Image
                uri={swapImageUrl}
                style={styles.swapImage}
                resizeMode="stretch"
              />
            </Pressable>
          </>
        )}
      </Card>

      <Text style={styles.chatHeaderText}>
        {t('chatHeader', {
          params: {
            userName:
              deal.item?.user?.name ??
              deal.item?.user?.email ??
              deal.item?.userId.substr(0, 6) + ' ...',
          },
        })}
      </Text>
      <Chat deal={deal} disableComposer={!isOpen} style={styles.chat} />
      {deal.userId !== user.id && deal.status === 'new' && (
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
      {deal?.status === 'accepted' && deal.userId !== user.id && (
        <Button title={t('closeBtnTitle')} onPress={closeHandler} />
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
    justifyContent: 'center',
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
  swapIcon: {
    marginHorizontal: -7,
    zIndex: 1000,
  },
  swapImageContainer: {},
  imageContainer: {},
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    backgroundColor: theme.colors.lightGrey,
  },
  swapImage: {
    width: swapImageSize,
    height: swapImageSize,
    borderRadius: swapImageSize / 2,
    backgroundColor: theme.colors.lightGrey,
  },
  date: {
    color: theme.colors.grey,
  },
  acceptButton: {
    marginBottom: 10,
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  rotateIcon: {
    // transform: [{rotate: '-180deg'}],
    transform: [{scaleX: -1}],
  },
  statusText: {
    position: 'absolute',
    backgroundColor: theme.colors.salmon,
    color: theme.colors.white,
    padding: 5,
    borderRadius: 5,
    // borderWidth: 2,
    overflow: 'hidden',
    top: 5,
    left: 5,
    zIndex: 1,
  },
  dealDateText: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    zIndex: 1,
    ...theme.styles.scale.body3,
  },
});

import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import dealsApi, {Deal} from '../api/dealsApi';
import itemsApi, {conditionList, ImageSource, Item} from '../api/itemsApi';
import {Image, Loader, Screen, Text} from '../components/core';
import Carousel from '../components/widgets/Carousel';
import Header from '../components/widgets/Header';
import ItemActivity from '../components/widgets/ItemActivity';
import ItemDetailsCard from '../components/widgets/ItemDetailsCard';
import ItemDetailsNav from '../components/widgets/ItemDetailsNav';
import OwnerItems from '../components/widgets/OwnerItems';
import Sheet from '../components/widgets/Sheet';
import SwapButton from '../components/widgets/SwapButton';
import {screens, stacks} from '../config/constants';
import swapTypes from '../data/swapTypes';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import useSheet from '../hooks/useSheet';
import useToast from '../hooks/useToast';
import {ItemDetailsRouteProp} from '../navigation/ItemsStack';
import {goBack} from '../navigation/NavigationHelper';
import theme from '../styles/theme';

export const ITEM_DETAILS_SCREEN_NAME = 'ItemDetailsScreen';
const ItemDetailsScreen = () => {
  const route = useRoute<ItemDetailsRouteProp>();
  const [item, setItem] = useState<Item>();
  const {loader, request} = useApi();
  const {user} = useAuth();
  const navigation = useNavigation<any>();
  const {t} = useLocale('itemDetailsScreen');
  const {show, sheetRef} = useSheet();
  const {showToast} = useToast();
  const refreshItem = useRef(false);

  const setHeader = (i: Item) => {
    navigation.setOptions({
      header: (props: any) => (
        <Header {...props}>
          <ItemDetailsNav
            item={i}
            onDelete={() =>
              show({
                header: t('deleteConfirmationHeader'),
                body: t('deleteConfirmationBody'),
                cancelCallback: () => console.log('canceling'),
                confirmCallback: () => deleteItem(i.id),
              })
            }
          />
        </Header>
      ),
    });
  };

  const resetHeader = () => {
    navigation.setOptions({
      header: (props: any) => <Header {...props} />,
    });
  };

  useEffect(() => {
    if (!route.params?.id) {
      navigation.navigate(stacks.ITEMS_STACK);
      return;
    }
    if (!!item && route.params?.id !== item.id) {
      console.log('resetting item');
      resetHeader();
      setItem(undefined);
    }
    itemsApi
      .getById(route.params?.id, {
        cache: {
          enabled: true,
        },
      })
      .then(i => {
        if (i) {
          setHeader(i);
          setItem(i);
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.id]);

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        console.log('delete by id', id);
        // await request(() => itemsApi.deleteById(id));
        await itemsApi.deleteById(id);
        console.log('finish delete');
        goBack({navigation, route});
      } catch (error) {
        console.error(error);
      }
    },

    [navigation, route],
  );

  const itemImage = useCallback(
    (itemInfo: {item: ImageSource}) => (
      <View style={styles.imageContainer}>
        <Image
          uri={itemInfo.item.downloadURL!}
          style={styles.image}
          resizeMode="cover"
        />
        <ItemActivity item={item!} style={styles.activityContainer} />
      </View>
    ),
    [item],
  );

  const swapHandler = useCallback(async () => {
    const existingDeals = await dealsApi.getUserDeals(user.id, item!);
    if (!!existingDeals && existingDeals.items.length > 0) {
      showToast({
        message: t('alreadyHasDealError'),
        type: 'error',
        options: {
          duration: 5000,
          autoHide: true,
        },
      });
      return;
    }
    show({
      header: t('swapHeader'),
      body: t('swapBody'),
      confirmCallback: async () => {
        try {
          const offer = await request<Deal>(() =>
            dealsApi.createOffer(user.id, item!),
          );
          refreshItem.current = true;
          navigation.navigate(stacks.DEALS_STACK, {
            screen: screens.DEAL_DETAILS,
            params: {
              id: offer.id,
              toastType: 'newOffer',
            },
          });
        } catch (error) {}
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, navigation, show, t, user.id]);

  const conditionName = conditionList.find(
    i => i.id === item?.condition?.type,
  )?.name;

  return item ? (
    <>
      <Screen scrollable={true} style={styles.screen}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          {item.userId !== user.id && (
            <SwapButton
              onPress={swapHandler}
              item={item}
              // iconStyle={styles.swapButton}
              iconSize={20}
            />
          )}
        </View>
        {!!item.description && (
          <Text style={styles.descriptionText}>{item.description}</Text>
        )}

        {item.images && item.images.length === 1 ? (
          <Image
            uri={item.images[0].downloadURL!}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Carousel images={item.images!} renderItem={itemImage} />
        )}

        {item.userId !== user.id && (
          <ItemDetailsCard
            title="Owner: "
            content={'Mohamed Aly'}
            icon="account-outline"
          />
        )}
        {item.userId === user.id && (
          <ItemDetailsCard
            title="Status: "
            content={item.status}
            icon="cast-connected"
            contentStyle={item.status === 'online' ? styles.greenText : {}}
          />
        )}

        <ItemDetailsCard
          title={t('itemConditionTitle')}
          content={conditionName ?? item.condition?.type}
          icon="cast-connected"
          contentStyle={(styles as any)[item.condition?.type]}>
          {/* {!!item.condition?.desc && (
          <Text style={styles.status}>{item.condition?.desc}</Text>
        )} */}
        </ItemDetailsCard>
        <ItemDetailsCard
          title={t('categoryTitle')}
          content={item.category.name}
          icon="category"
          iconType="svg"
        />

        <ItemDetailsCard
          title={
            item.swapOption.type === 'swapWithAnother'
              ? 'Swap with: '
              : t('swapTypeTitle')
          }
          content={
            item.swapOption.type === 'swapWithAnother'
              ? (item.swapOption?.category as any)?.name ??
                item.swapOption.category
              : swapTypes.find(type => type.id === item.swapOption.type)
                  ?.name ?? item.swapOption.type
          }
          icon="handshake"
          contentStyle={(styles as any)[item.swapOption.type]}
        />
        <ItemDetailsCard
          title={t('addressTitle')}
          content={item.location?.city + ', ' + item.location?.country?.name}
          icon="google-maps"
        />

        {!!item && item.userId !== user.id && route.params?.id === item.id && (
          <OwnerItems item={item} style={styles.ownerItems} />
        )}

        <Sheet ref={sheetRef} />
        {loader}
      </Screen>
      {item.userId !== user.id && (
        <Pressable style={styles.swapContainer} onPress={swapHandler}>
          <Text style={styles.swapButton}>Send swap offer</Text>
        </Pressable>
      )}
    </>
  ) : (
    <Loader />
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    marginTop: 10,
    paddingBottom: 20,
    // marginBottom: 70,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nameText: {
    color: theme.colors.salmon,
    ...theme.styles.scale.h5,
  },
  descriptionText: {
    marginBottom: 10,
  },

  greenText: {
    color: theme.colors.green,
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    height: 200,
    // width: 500,
    maxHeight: 200,
    borderRadius: 20,
    marginBottom: 10,
  },
  activityContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  descriptionContainer: {
    flexDirection: 'row',
    // marginTop: 10,
  },
  rowTitle: {
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
  },
  conditionTitle: {
    // width: 50,
    // flexWrap: 'nowrap',
  },
  conditionColumn: {
    flexShrink: 1,
  },
  // rowTitle: {
  //   color: theme.colors.salmon,
  //   fontWeight: theme.fontWeight.semiBold,
  //   flexShrink: 0,
  // },
  status: {
    color: theme.colors.grey,
    fontWeight: theme.fontWeight.semiBold,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // backgroundColor: 'grey',
    // overflow: 'hidden',
  },

  location: {
    // flexGrow: 0,
    // flex: 1,
    height: 150,
    marginBottom: 10,
  },

  addressContainer: {},

  ownerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  ownerIcon: {
    marginLeft: -5,
  },
  confirmText: {
    ...theme.styles.scale.h6,
  },
  freeImage: {
    position: 'absolute',
    top: -5,
    left: 10,
    width: 70,
    height: 70,
    transform: [{rotate: '-10deg'}],
  },
  // swapButton: {
  //   height: 30,
  //   // backgroundColor: 'grey',
  // },

  swapContainer: {
    // position: 'absolute',
    // bottom: 0,
    height: 60,
    marginHorizontal: 5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: theme.colors.salmon,
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapButton: {
    color: theme.colors.white,
    ...theme.styles.scale.h6,
  },
  ownerItems: {
    marginTop: 20,
  },
  used: {
    color: theme.colors.orange,
  },
  free: {
    color: theme.colors.green,
  },
});

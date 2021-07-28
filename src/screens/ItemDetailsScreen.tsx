import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dealsApi, {Deal} from '../api/dealsApi';
import itemsApi, {conditionList, ImageSource, Item} from '../api/itemsApi';
import {Image, Loader, Screen, Text} from '../components/core';
import Carousel from '../components/widgets/Carousel';
import ItemActivity from '../components/widgets/ItemActivity';
import ItemDetailsNav from '../components/widgets/ItemDetailsNav';
import LocationView from '../components/widgets/LocationView';
import OwnerItems from '../components/widgets/OwnerItems';
import Sheet from '../components/widgets/Sheet';
import SwapButton from '../components/widgets/SwapButton';
import TextDescription from '../components/widgets/TextDescription';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import useSheet from '../hooks/useSheet';
import {ItemDetailsRouteProp} from '../navigation/HomeStack';
import theme from '../styles/theme';
import {HOME_SCREEN} from './HomeScreen';
import {MY_ITEMS_SCREEN} from './MyItemsScreen';
import FreeIcon from '../assets/svgs/free.svg';
import useToast from '../hooks/useToast';

export const ITEM_DETAILS_SCREEN_NAME = 'ItemDetailsScreen';
const ItemDetailsScreen = () => {
  const route = useRoute<ItemDetailsRouteProp>();
  const [item, setItem] = useState<Item>();
  const {loader, request} = useApi({loadingInitValue: true});
  const {user} = useAuth();
  const navigation = useNavigation();
  const state = useNavigationState(s => s);
  const {t} = useLocale('itemDetailsScreen');
  const {show, sheetRef} = useSheet();
  const {showToast} = useToast();
  const refreshItem = useRef(false);

  const loadData = async () => {
    console.log('route.params', route.params);
    const itemId = route.params?.id;

    if (itemId) {
      const freshItem = await request<Item>(() =>
        itemsApi.getById(itemId, {cache: {enabled: true}}),
      );
      if (freshItem) {
        setItem(freshItem);
      }
      return freshItem;
    }
  };

  useEffect(() => {
    loadData().then(i => {
      if (i) {
        navigation.setOptions({
          headerRight: () => (
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
          ),
          headerTitle:
            i.name.trim().length > 20
              ? i.name.substr(0, 20).trim() + ' ...'
              : i.name,
        });
      } else {
        console.warn('item not found', i);
        navigation.navigate(MY_ITEMS_SCREEN);
      }
    });
    console.log('route', route.params?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.id]);

  useFocusEffect(() => {
    if (refreshItem.current === true) {
      refreshItem.current = false;
      loadData().then(() => console.log('useFocusEffect'));
    }
  });

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await request(() =>
          itemsApi.deleteById(id, {
            cache: {evict: `${itemsApi.MY_ITEMS_CACHE_KEY}_${user.id}`},
          }),
        );
        if (navigation.canGoBack()) {
          const routes = state.routes;
          if (routes[routes.length - 2]?.name === MY_ITEMS_SCREEN) {
            navigation.navigate(screens.MY_ITEMS, {lastRefresh: Date.now()});
          } else {
            navigation.goBack();
          }
        } else {
          navigation.navigate(screens.HOME_TABS);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [navigation, request, state.routes, user.id],
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
          navigation.navigate(screens.DEAL_DETAILS, {
            id: offer.id,
            toastType: 'newOffer',
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
    <Screen scrollable={true} style={styles.screen}>
      {item.images && item.images.length === 1 ? (
        <Image
          uri={item.images[0].downloadURL!}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Carousel images={item.images!} renderItem={itemImage} />
      )}

      <View style={[styles.row, styles.ownerContainer]}>
        <View style={styles.categoryContainer}>
          <Icon
            style={styles.ownerIcon}
            name="account-outline"
            size={40} // TODO change to responsive
            color={theme.colors.grey}
            //   onPress={toggleEyeIcon}
          />
          <Text>{item.category.name}</Text>
        </View>
        {item.userId !== user.id && (
          <SwapButton
            onPress={swapHandler}
            item={item}
            iconStyle={styles.swapButton}
            iconSize={20}
          />
        )}
      </View>
      {!!item.description && (
        <View style={styles.row}>
          <Text style={styles.statusTitle}>{t('itemDescriptionTitle')}</Text>
          <TextDescription>{item.description}</TextDescription>
        </View>
      )}
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>{t('itemConditionTitle')}</Text>
        <View>
          <Text style={styles.status}>
            {conditionName ?? item.condition?.type}
          </Text>
          {!!item.condition?.desc && <Text>{item.condition?.desc}</Text>}
        </View>
      </View>

      {!!item?.description ?? (
        <TextDescription>{item.description}</TextDescription>
      )}
      <View style={[styles.row, styles.statusContainer]}>
        <Text style={styles.rowTitle}>{t('addressTitle')}</Text>
        <Text numberOfLines={2}>
          {item.location?.city}, {item.location?.country?.name}
        </Text>
      </View>
      <LocationView location={item.location!} style={styles.location} />

      {!!item && item.userId !== user.id && route.params?.id === item.id && (
        <OwnerItems item={item} />
      )}
      {/* {ConfirmSheet} */}
      <Sheet ref={sheetRef} />

      {item?.swapOption?.type === 'free' && (
        <View style={styles.freeImage}>
          <FreeIcon width={60} height={60} fill={theme.colors.salmon} />
        </View>
      )}
      {loader}
    </Screen>
  ) : (
    <Loader />
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    marginTop: 10,
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    height: 200,
    // width: 500,
    maxHeight: 200,
    borderRadius: 20,
  },
  activityContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  nameText: {
    marginBottom: 10,
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statusTitle: {
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
  },
  rowTitle: {
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
    flexShrink: 0,
  },
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
  swapButton: {
    height: 30,
    // backgroundColor: 'grey',
  },
});

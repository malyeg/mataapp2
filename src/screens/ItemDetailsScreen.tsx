import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dealsApi from '../api/dealsApi';
import itemsApi, {conditionList, ImageSource, Item} from '../api/itemsApi';
import {Image, Loader, Screen, Text} from '../components/core';
import Carousel from '../components/widgets/Carousel';
import ItemActivity from '../components/widgets/ItemActivity';
import ItemDetailsNav from '../components/widgets/ItemDetailsNav';
import LocationView from '../components/widgets/LocationView';
import OwnerItemList from '../components/widgets/OwnerItemList';
import Sheet from '../components/widgets/Sheet';
import SwapButton from '../components/widgets/SwapButton';
import TextDescription from '../components/widgets/TextDescription';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import useSheet from '../hooks/useSheet';
import useToast from '../hooks/useToast';
import {ItemDetailsRouteProp} from '../navigation/HomeStack';
import theme from '../styles/theme';
import {HOME_SCREEN} from './HomeScreen';
import {MY_ITEMS_SCREEN} from './MyItemsScreen';

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
  const {showToast, hideToast} = useToast();

  useEffect(() => {
    const loadData = async () => {
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
                  cancelCallback: () => console.log('canceliing'),
                  confirmCallback: deleteItem,
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

  const deleteItem = useCallback(async () => {
    try {
      await request(() =>
        itemsApi.delete(item!, {
          cache: {evict: `${itemsApi.MY_ITEMS_CACHE_KEY}_${user.id}`},
        }),
      );
      if (navigation.canGoBack()) {
        const routes = state.routes;
        if (routes[routes.length - 2]?.name === MY_ITEMS_SCREEN) {
          navigation.navigate(MY_ITEMS_SCREEN, {refresh: true});
        } else {
          navigation.goBack();
        }
      } else {
        navigation.navigate(HOME_SCREEN);
      }
    } catch (error) {
      console.error(error);
    }
  }, [item, navigation, request, state.routes, user.id]);

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
    // show({
    //   header: t('swapHeader'),
    //   body: t('swapBody'),
    //   confirmCallback: async () => {
    //     try {
    //       const offer = await dealsApi.createOffer(user.id, item!);
    //       navigation.navigate(screens.DEAL_DETAILS_SCREEN, {
    //         id: offer.id,
    //         toastType: 'newOffer',
    //       });
    //     } catch (error) {}
    //   },
    // });
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
          <SwapButton onPress={swapHandler} item={item} />
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
          {item.location?.address?.formattedAddress}
        </Text>
      </View>
      <LocationView location={item.location!} style={styles.location} />

      {!!item && item.userId !== user.id && route.params?.id === item.id && (
        <OwnerItemList item={item} />
      )}
      {/* {ConfirmSheet} */}
      <Sheet ref={sheetRef} />

      {item?.swapOption?.type === 'free' && (
        <Image
          style={styles.freeImage}
          uri={'https://www.freeiconspng.com/uploads/free-icon-0.png'}
        />
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
    top: -10,
    left: 0,
    width: 70,
    height: 70,
    transform: [{rotate: '-10deg'}],
  },
});

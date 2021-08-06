import {
  NavigationHelpers,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dealsApi, {Deal} from '../api/dealsApi';
import itemsApi, {conditionList, ImageSource, Item} from '../api/itemsApi';
import FreeIcon from '../assets/svgs/free.svg';
import {Image, Loader, Screen, Text} from '../components/core';
import Carousel from '../components/widgets/Carousel';
import Header from '../components/widgets/Header';
import ItemActivity from '../components/widgets/ItemActivity';
import ItemDetailsNav from '../components/widgets/ItemDetailsNav';
import LocationView from '../components/widgets/LocationView';
import OwnerItems from '../components/widgets/OwnerItems';
import Sheet from '../components/widgets/Sheet';
import SwapButton from '../components/widgets/SwapButton';
import TextDescription from '../components/widgets/TextDescription';
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
  const navigation = useNavigation<NavigationHelpers>();
  const {t} = useLocale('itemDetailsScreen');
  const {show, sheetRef} = useSheet();
  const {showToast} = useToast();
  const refreshItem = useRef(false);

  const setHeader = (i: Item) => {
    navigation.setOptions({
      header: (props: any) => (
        <Header
          {...props}
          title={
            i.name.trim().length > 20
              ? i.name.substr(0, 20).trim() + ' ...'
              : i.name
          }>
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
      header: (props: any) => <Header title="" {...props} />,
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
      <View style={styles.statusContainer}>
        <Text style={styles.rowTitle}>{t('statusTitle')}</Text>
        <View>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </View>
      {!!item.description && (
        <View style={styles.descriptionContainer}>
          <View>
            <Text style={styles.rowTitle}>{t('itemDescriptionTitle')}</Text>
          </View>
          {/* <TextDescription>{item.description}</TextDescription> */}
          <Text style={styles.status}>{item.description}</Text>
        </View>
      )}
      <View style={styles.rowContainer}>
        <View style={styles.conditionTitle}>
          <Text style={[styles.rowTitle]}>{t('itemConditionTitle')}</Text>
        </View>
        <View style={styles.conditionColumn}>
          <Text style={styles.status}>
            {conditionName ?? item.condition?.type}
          </Text>
          {!!item.condition?.desc && (
            <Text style={styles.status}>{item.condition?.desc}</Text>
          )}
        </View>
      </View>

      {!!item?.description ?? (
        <TextDescription textStyle={styles.status}>
          {item.description}
        </TextDescription>
      )}

      <View style={styles.statusContainer}>
        <Text style={styles.rowTitle}>{t('swapTypeTitle')}</Text>
        <Text style={styles.status}>
          {swapTypes.find(type => type.id === item.swapOption.type)?.name}
        </Text>
      </View>

      {item.swapOption.type === 'swapWithAnother' && (
        <View style={styles.statusContainer}>
          <Text style={styles.rowTitle}>{t('swapCategoryTitle')}</Text>
          <Text style={styles.status}>
            {item.swapOption?.category?.name ?? item.swapOption.category}
          </Text>
        </View>
      )}

      <View style={[styles.row, styles.statusContainer]}>
        <Text style={styles.rowTitle}>{t('addressTitle')}</Text>
        <Text style={styles.status}>
          {item.location?.city}, {item.location?.country?.name}
        </Text>
      </View>

      <LocationView location={item.location!} style={styles.location} />

      {!!item && item.userId !== user.id && route.params?.id === item.id && (
        <OwnerItems item={item} />
      )}

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
  swapButton: {
    height: 30,
    // backgroundColor: 'grey',
  },
});

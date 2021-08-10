import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View, ViewProps} from 'react-native';
import {Item} from '../../api/itemsApi';
import FreeIcon from '../../assets/svgs/free.svg';
import constants, {screens, stacks} from '../../config/constants';
import theme from '../../styles/theme';
import {Image, Text} from '../core';
import SwapIcon from './SwapIcon';

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
export const ITEM_CARD_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface ItemCardProps extends ViewProps {
  item: Item;
  showActivityStatus?: boolean;
  onSwap?: (item: Item) => void;
  showSwapIcon?: boolean;
}
const ItemCard = ({
  item,
  style,
  showActivityStatus,
  showSwapIcon = false,
}: ItemCardProps) => {
  const navigation = useNavigation<StackNavigationHelpers>();
  const route = useRoute();
  // const linkTo = useLinkTo();

  const openItemDetails = useCallback(() => {
    navigation.navigate(stacks.ITEMS_STACK, {
      screen: screens.ITEM_DETAILS,
      params: {
        id: item.id,
        fromScreen: route.name,
      },
    });
    // linkTo('/items/' + item.id);
  }, [item.id, navigation, route.name]);

  const imageUrl =
    item.defaultImageURL ?? (!!item?.images && !!item?.images[0]?.downloadURL)
      ? item?.images[0].downloadURL
      : constants.firebase.TEMP_IMAGE_URL;

  // console.log(item.status);

  return (
    <Pressable style={[styles.card, style]} onPress={openItemDetails}>
      <View style={styles.cardHeader}>
        {item?.swapOption?.type === 'free' && (
          <FreeIcon
            width={30}
            height={30}
            fill={theme.colors.salmon}
            style={styles.freeImage}
          />
        )}
        {showSwapIcon && <SwapIcon item={item} />}
        {showActivityStatus && (
          <View
            style={[
              styles.activityStatusContainer,
              item.status === 'online' ? styles.onlineBackgroundColor : {},
            ]}>
            <Text style={[styles.activityStatusText]}>{item.status}</Text>
          </View>
        )}
      </View>

      <Image uri={imageUrl!} style={styles.image} />

      <Text numberOfLines={1} style={styles.nameText}>
        {item.name}
      </Text>
      <View style={styles.cardCategory}>
        <Text style={styles.categoryText}>{item.category?.name}</Text>
      </View>
    </Pressable>
  );
};

export default React.memo(ItemCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: 150,
    height: 200,
    paddingHorizontal: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 2,
    // backgroundColor: 'grey',
    // flex: 1,
    height: 30,
  },
  activityStatusContainer: {
    // position: 'absolute',
    // marginTop: 5,
    // right: 0,
    width: 45,
    height: 25,
    borderTopLeftRadius: 11.5,
    borderBottomLeftRadius: 11.5,
    backgroundColor: theme.colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityStatusText: {
    color: theme.colors.white,
    ...theme.styles.scale.body3,
  },
  onlineBackgroundColor: {
    backgroundColor: theme.colors.green,
  },
  image: {
    flex: 3,
    marginBottom: 5,
    backgroundColor: 'grey',
  },
  cardCategory: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    // flex: 1,
    width: '100%',
    borderTopColor: theme.colors.lightGrey,
    borderTopWidth: 2,
    paddingVertical: 3,
  },
  categoryText: {
    ...theme.styles.scale.body2,
  },
  nameText: {
    ...theme.styles.scale.body2,
    fontWeight: theme.fontWeight.semiBold,
    paddingBottom: 3,
  },
  freeImage: {
    marginRight: 'auto',
    width: 35,
    height: 35,
    transform: [{rotate: '-10deg'}],
  },
});

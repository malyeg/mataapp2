import {useNavigation} from '@react-navigation/core';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View, ViewProps} from 'react-native';
import {Item} from '../../api/itemsApi';
import FreeIcon from '../../assets/svgs/free.svg';
import useAuth from '../../hooks/useAuth';
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
  const navigtion = useNavigation();

  const openItemDetails = useCallback(() => {
    // TODO refactor to constant
    navigtion.navigate('ItemDetailsScreen', {
      id: item.id,
    });
  }, [item, navigtion]);

  const imageUrl = item.defaultImageURL
    ? item.defaultImageURL
    : item.images[0].downloadURL;

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
              styles.actvityStatusContainer,
              item.status === 'online' ? styles.onlineBackgroundColor : {},
            ]}>
            <Text style={[styles.actvityStatusText]}>{item.status}</Text>
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
    paddingHorizontal: 7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 2,
    // backgroundColor: 'grey',
  },
  viewsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 6,
  },
  actvityStatusContainer: {
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
  actvityStatusText: {
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
    flex: 1,
    width: '100%',
    borderTopColor: theme.colors.lightGrey,
    borderTopWidth: 2,
  },
  categoryText: {
    ...theme.styles.scale.body2,
  },
  nameText: {
    ...theme.styles.scale.body2,
    fontWeight: theme.fontWeight.semiBold,
  },
  freeImage: {
    // position: 'absolute',
    // alignSelf: 'flex-start',
    marginRight: 'auto',
    // top: -10,
    // left: -10,
    width: 35,
    height: 35,
    transform: [{rotate: '-10deg'}],
  },
});

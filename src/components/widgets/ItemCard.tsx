import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View, ViewProps} from 'react-native';
import {Item} from '../../api/itemsApi';
import constants, {screens} from '../../config/constants';
import theme from '../../styles/theme';
import {Icon, Image, Text} from '../core';
import SwapIcon from './SwapIcon';

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
export const ITEM_CARD_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface ItemCardProps extends ViewProps {
  item: Item;
  showActivityStatus?: boolean;
  onSwap?: (item: Item) => void;
  showSwapIcon?: boolean;
  onPress?: (item: Item) => void;
}
const ItemCard = ({
  item,
  style,
  showActivityStatus,
  onPress,
  showSwapIcon = false,
}: ItemCardProps) => {
  const navigation = useNavigation<StackNavigationHelpers>();
  const route = useRoute();
  // const linkTo = useLinkTo();

  const openItemDetails = useCallback(() => {
    if (onPress) {
      onPress(item);
    } else {
      navigation.navigate(screens.ITEM_DETAILS, {
        id: item.id,
      });
    }

    // linkTo('/items/' + item.id);
  }, [item, navigation, onPress]);

  const imageUrl =
    item.defaultImageURL ?? (!!item?.images && !!item?.images[0]?.downloadURL)
      ? item?.images[0].downloadURL
      : constants.firebase.TEMP_IMAGE_URL;

  // console.log(item.status);

  return (
    <Pressable style={[styles.card, style]} onPress={openItemDetails}>
      <View style={styles.cardHeader}>
        {item?.swapOption?.type === 'free' && (
          <Icon
            size={30}
            color={theme.colors.salmon}
            style={styles.freeImage}
            name="free"
            type="svg"
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
    height: 30,
  },
  activityStatusContainer: {
    width: 60,
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
    textTransform: 'capitalize',
  },
  onlineBackgroundColor: {
    backgroundColor: theme.colors.green,
  },
  image: {
    flex: 1,
    // width: 125,
    // height: 125,
    marginBottom: 5,
    backgroundColor: 'grey',
    borderRadius: 10,
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

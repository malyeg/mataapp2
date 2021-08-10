import {useNavigation} from '@react-navigation/core';
import React, {useCallback} from 'react';
import {Dimensions, Pressable, StyleSheet, View, ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import {Item} from '../../api/itemsApi';
import theme from '../../styles/theme';
import {Image, Text} from '../core';
import SwapIcon from './SwapIcon';
import Icon from '../core/Icon';
import categoriesApi from '../../api/categoriesApi';
import {screens, stacks} from '../../config/constants';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';

interface ItemCardProps extends ViewProps {
  item: Item;
  showActivityStatus?: boolean;
  onSwap?: (item: Item) => void;
  showSwapIcon?: boolean;
}

const windowWidth = Dimensions.get('window').width * 0.8;

const RecommendedCard = ({item, style}: ItemCardProps) => {
  const navigation = useNavigation<StackNavigationHelpers>();

  const openItemDetails = useCallback(() => {
    // TODO refactor to constant
    navigation.navigate(stacks.ITEMS_STACK, {
      screen: screens.ITEM_DETAILS,
      params: {id: item.id, fromScreen: screens.HOME},
    });
  }, [item, navigation]);

  const imageUrl = item.defaultImageURL ?? item.images[0].downloadURL;

  // console.log(item.status);

  const category = categoriesApi.getAll().find(c => c.id === item.category.id);

  return (
    <Pressable style={[styles.card, style]} onPress={openItemDetails}>
      <Image uri={imageUrl!} style={styles.image} />
      {item?.swapOption?.type === 'free' && (
        <Icon
          name="free"
          size={35}
          color={theme.colors.salmon}
          style={styles.freeImage}
        />
      )}

      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.categoryText}>{item.category?.name}</Text>
          <Text numberOfLines={1} style={styles.nameText}>
            {item.name}
          </Text>
        </View>
        <SwapIcon item={item} style={styles.swapIcon} />
      </View>
      {(!!item.category?.style?.iconName || !!category?.style?.iconName) && (
        <Icon
          name={
            item.category?.style?.iconName ??
            category?.style?.iconName ??
            'home-outline'
          }
          size={40}
          color={theme.colors.grey}
          style={styles.categoryIcon}
        />
      )}
    </Pressable>
  );
};

export const RecommendedCardSkeleton = () => (
  <View style={styles.shimmerContainer}>
    <ShimmerPlaceHolder
      LinearGradient={LinearGradient}
      style={styles.shimmerImage}
    />
    <View>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={styles.categoryText}
      />
    </View>
  </View>
);

export default React.memo(RecommendedCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: windowWidth,
    padding: 5,
  },
  image: {
    width: 125,
    height: 125,
    borderRadius: 10,
  },
  contentContainer: {
    alignItems: 'flex-start',
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryText: {
    ...theme.styles.scale.body2,
    color: theme.colors.grey,
  },
  nameText: {
    ...theme.styles.scale.body2,
    fontWeight: theme.fontWeight.semiBold,
    paddingBottom: 3,
  },
  freeImage: {
    position: 'absolute',
    // marginRight: 'auto',
    right: 10,
    // width: 70,
    // height: 70,
    // transform: [{rotate: '-10deg'}],
  },
  swapIcon: {
    // marginBottom: 'auto',
    // flexGrow: 1,
    // flex: 1,
    // alignSelf: 'flex-end',
  },
  categoryIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },

  shimmerContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: windowWidth,
    padding: 5,
  },
  shimmerImage: {
    width: 125,
    height: 125,
    borderRadius: 10,
  },
});

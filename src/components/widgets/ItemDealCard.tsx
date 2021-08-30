import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import React, {useCallback} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ImageStyle} from 'react-native-fast-image';
import {Deal} from '../../api/dealsApi';
import itemsApi from '../../api/itemsApi';
import {patterns, screens} from '../../config/constants';
import theme from '../../styles/theme';
import {Image, Text} from '../core';
import Card from '../core/Card';

interface DealCardProps {
  deal: Deal;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
}

const imageSize = 50;
const ItemDealCard = ({deal, style, imageStyle, onPress}: DealCardProps) => {
  const navigation = useNavigation<DrawerNavigationHelpers>();
  const onCardPress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate(screens.DEAL_DETAILS, {id: deal.id});
    }
  }, [deal.id, navigation, onPress]);
  // const imageUrl = itemsApi.getImageUrl(deal.item)!;
  const swapImageUrl = deal.swapItem
    ? itemsApi.getImageUrl(deal.swapItem)
    : undefined;

  return (
    <Card
      style={[styles.container, style]}
      icon={
        deal.item.swapOption.type === 'free'
          ? {name: 'free', type: 'svg', size: 40}
          : undefined
      }
      onPress={onCardPress}>
      {deal.item.swapOption.type !== 'free' && (
        <View style={styles.imageContainer}>
          <Image uri={swapImageUrl!} style={[styles.image, imageStyle]} />
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {deal.item?.user?.name ??
            deal.item?.user?.email ??
            deal.item.category.name}
        </Text>
        {!!deal.timestamp && (
          <Text style={styles.date}>
            {format(deal.timestamp, patterns.DATE)}
          </Text>
        )}
      </View>
    </Card>
  );
};

export default ItemDealCard;

const styles = StyleSheet.create({
  container: {},
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  },
  contentContainer: {
    marginLeft: 20,
    // flexGrow: 1,
  },
  date: {
    color: theme.colors.grey,
  },
  name: {
    // paddingHorizontal: 20,
  },
});

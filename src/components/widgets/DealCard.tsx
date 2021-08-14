import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import React, {useCallback} from 'react';
import {
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Deal} from '../../api/dealsApi';
import itemsApi from '../../api/itemsApi';
import {patterns, screens} from '../../config/constants';
import theme from '../../styles/theme';
import {Icon, Image, Text} from '../core';

interface DealCardProps {
  deal: Deal;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
}
const DealCard = ({deal, style, imageStyle, onPress}: DealCardProps) => {
  const navigation = useNavigation<DrawerNavigationHelpers>();
  const onCardPress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate(screens.DEAL_DETAILS, {id: deal.id});
    }
  }, [deal.id, navigation, onPress]);
  const imageUrl = itemsApi.getImageUrl(deal.item)!;
  const swapImageUrl = deal.swapItem
    ? itemsApi.getImageUrl(deal.swapItem)
    : undefined;

  return (
    <Pressable style={[styles.container, style]} onPress={onCardPress}>
      <View style={styles.imageContainer}>
        <Image uri={imageUrl} style={[styles.image, imageStyle]} />
        {!!deal.swapItem && (
          <>
            <Icon
              name="swap"
              type="svg"
              size={20}
              color={theme.colors.salmon}
            />
            <Image uri={swapImageUrl!} style={[styles.image, imageStyle]} />
          </>
        )}
      </View>

      <View style={styles.contentContainer}>
        {!!deal.timestamp && (
          <Text style={styles.date}>
            {format(deal.timestamp, patterns.DATE)}
          </Text>
        )}
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {deal.item?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default DealCard;

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 10,
    paddingLeft: 50,
  },
  imageContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 5,
    // left: 10,
    // marginRight: 20,
  },
  contentContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginLeft: 70,
  },
  date: {
    color: theme.colors.grey,
  },
  name: {
    // paddingHorizontal: 20,
  },
});

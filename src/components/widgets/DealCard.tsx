import React, {useCallback} from 'react';
import {
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {format} from 'date-fns';
import {Deal} from '../../api/dealsApi';
import theme from '../../styles/theme';
import {Image, Text} from '../core';
import {useNavigation} from '@react-navigation/native';
import {screens, stacks} from '../../config/constants';
import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';

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
  const imageUrl = deal.item?.defaultImageURL
    ? deal.item.defaultImageURL
    : deal.item?.images[0].downloadURL;
  return (
    <Pressable style={[styles.container, style]} onPress={onCardPress}>
      <Image uri={imageUrl} style={[styles.image, imageStyle]} />
      <View>
        {!!deal.timestamp && (
          <Text style={styles.date} numberOfLines={2} ellipsizeMode="tail">
            {format(deal.timestamp, 'MMMM do, yyyy')}
          </Text>
        )}
        <Text>{deal.item?.name}</Text>
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
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginHorizontal: 20,
  },
  date: {
    color: theme.colors.grey,
  },
});

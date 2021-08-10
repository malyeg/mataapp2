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
      <View style={styles.contentContainer}>
        {!!deal.timestamp && (
          <Text style={styles.date}>
            {format(deal.timestamp, 'MMMM do, yyyy')}
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
  image: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 5,
    left: 10,
    // marginRight: 20,
  },
  contentContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  date: {
    color: theme.colors.grey,
  },
  name: {
    // paddingHorizontal: 20,
  },
});

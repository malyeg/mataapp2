import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {format} from 'date-fns';
import {Deal} from '../../api/dealsApi';
import theme from '../../styles/theme';
import {Image, Text} from '../core';
import {useNavigation} from '@react-navigation/native';
import {screens} from '../../config/constants';

interface DealCardProps {
  deal: Deal;
}
const DealCard = ({deal}: DealCardProps) => {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.navigate(screens.DEAL_DETAILS, {id: deal.id});
  }, [deal.id, navigation]);
  const imageUrl = deal.item.defaultImageURL
    ? deal.item.defaultImageURL
    : deal.item.images[0].downloadURL;
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image uri={imageUrl} style={styles.image} />
      <View>
        {!!deal.timestamp && (
          <Text style={styles.date}>
            {format(deal.timestamp, 'MMMM do, yyyy')}
          </Text>
        )}
        <Text>{deal.item.name}</Text>
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

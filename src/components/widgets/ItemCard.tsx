import {useNavigation} from '@react-navigation/core';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View, ViewProps} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Item} from '../../api/itemsApi';
import theme from '../../styles/theme';
import {Image, Text} from '../core';

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
export const ITEM_CARD_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface ItemCardProps extends ViewProps {
  item: Item;
  showActivityStatus?: boolean;
  onSwap?: (item: Item) => void;
}
const ItemCard = ({item, style, showActivityStatus}: ItemCardProps) => {
  const navigtion = useNavigation();

  const openItemDetails = useCallback(() => {
    // TODO refactor to constant
    navigtion.navigate('ItemDetailsScreen', {
      id: item.id,
    });
  }, [item, navigtion]);

  return (
    <Pressable style={[styles.card, style]} onPress={openItemDetails}>
      <View style={styles.cardHeader}>
        <Text body2>{item?.swapOption?.type}</Text>
        {/* <Text body2>{item.condition?.type === 'new' ? 'new' : 'used'}</Text> */}
      </View>
      {showActivityStatus && (
        <View
          style={[
            styles.actvityStatusContainer,
            item.status === 'online' ? styles.onlineBackgroundColor : {},
          ]}>
          <Text style={[styles.actvityStatusText]}>{item.status}</Text>
        </View>
      )}
      <Image uri={item.defaultImageURL!} style={styles.image} />
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
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  viewsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 6,
  },
  actvityStatusContainer: {
    position: 'absolute',
    marginTop: 5,
    right: 0,
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
  eyeIcon: {
    marginRight: -5,
  },
  image: {
    flex: 3,
    marginBottom: 5,
    backgroundColor: 'grey',
  },
  // image: {
  //   flex: 1,
  // },
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
  },

  userId: {
    fontSize: 10,
  },
});

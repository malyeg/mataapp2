import React, {useMemo, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import categoriesApi from '../../api/categoriesApi';
import itemsApi from '../../api/itemsApi';
import {ListItem} from '../../api/listsApi';
import {screens} from '../../config/constants';
import useNavigationHelper from '../../hooks/useNavigationHelper';
import theme from '../../styles/theme';
import {Button, Icon, Image, Modal, Text} from '../core';
import Card from '../core/Card';
import SwapIcon from './SwapIcon';

interface WishCardProps {
  listItem: ListItem;
  style?: StyleProp<ViewStyle>;
}

const NotificationCard = ({listItem, style}: WishCardProps) => {
  const {navigation} = useNavigationHelper();
  const [isVisible, setVisible] = useState(false);
  const onCardPress = () => {
    if (listItem.isAvailable) {
      navigation.navigate(screens.ITEM_DETAILS, {id: listItem.item.id});
    } else {
      console.log('showing modal');
      setVisible(true);
    }
    // if (listItem?.isAvailable) {
    //   navigation.navigate(screens.ITEM_DETAILS, {id: listItem.item.id});
    // }
  };
  const item = listItem.item;
  const imageUrl = itemsApi.getImageUrl(listItem.item);
  const category = useMemo(
    () => categoriesApi.getAll().find(c => c.id === item.category.id),
    [item.category.id],
  );
  const onShowPress = () => {
    navigation.navigate(screens.ITEMS, {categoryId: listItem.item.category.id});
  };
  return (
    <>
      <Card onPress={onCardPress}>
        <Image uri={imageUrl!} style={styles.image} />
        {listItem.item?.swapOption?.type === 'free' && (
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
            <Text
              numberOfLines={1}
              style={styles.nameText}
              ellipsizeMode="tail">
              {item.name}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.descriptionText}
              ellipsizeMode="tail">
              {item.description}
            </Text>
          </View>
          {listItem.isAvailable !== true && (
            <Text style={styles.notAvailable}>Not available</Text>
          )}
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
      </Card>
      {!listItem.isAvailable && (
        <Modal isVisible={isVisible} title={'Not available'}>
          <View>
            <Text>Item is no longer available, show similar items?</Text>
            <View style={styles.modalButtonsContainer}>
              <Button
                title="show"
                themeType="primary"
                style={styles.modalButton}
                onPress={onShowPress}
              />
              <Button
                title="cancel"
                themeType="white"
                style={styles.modalButton}
                onPress={() => setVisible(false)}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default React.memo(NotificationCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    // width: windowWidth,
    padding: 5,
  },
  image: {
    flex: 0.8,
    // width: 125,
    // height: 125,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryText: {
    ...theme.styles.scale.body1,
    color: theme.colors.grey,
  },
  nameText: {
    ...theme.styles.scale.body2,
    fontWeight: theme.fontWeight.semiBold,
    paddingVertical: 5,
  },
  descriptionText: {
    ...theme.styles.scale.body3,
    fontWeight: theme.fontWeight.semiBold,
    paddingBottom: 3,
  },
  freeImage: {
    position: 'absolute',
    right: 10,
  },
  swapIcon: {},
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
    // width: windowWidth,
    padding: 5,
  },
  shimmerImage: {
    width: 125,
    height: 125,
    borderRadius: 10,
  },
  notAvailable: {
    backgroundColor: 'red',
    color: theme.colors.white,
    borderRadius: 5,
    padding: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    // backgroundColor: 'grey',
  },
  modalButton: {
    flexBasis: '45%',
  },
});

import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Item} from '../../api/itemsApi';
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme';
import ItemEditIcon from './icons/ItemEditIcon';
import ShareIcon from './ShareIcon';

interface ItemDetailsNavProps {
  item: Item;
  onDelete?: (item: Item) => void;
}
const ItemDetailsNav = ({item, onDelete}: ItemDetailsNavProps) => {
  const {user} = useAuth();

  const onDeleteHandler = useCallback(() => {
    if (onDelete) {
      onDelete(item);
    }
  }, [item, onDelete]);

  const shareLink = `https://mataapp.page.link/?link=https%3A%2F%2Fmataup.com/items%3Fid%3D${item.id}&apn=com.mataapp`;

  return (
    <View style={styles.container}>
      <ShareIcon message={shareLink} style={styles.shareIcon} />
      {item.userId === user.id && <ItemEditIcon onDelete={onDeleteHandler} />}
    </View>
  );
};

export default ItemDetailsNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginRight: theme.defaults.SCREEN_PADDING,
  },
  shareIcon: {
    marginHorizontal: 10,
  },
});

import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../../styles/theme';
import PressableObacity from '../../core/PressableObacity';

interface ItemEditIconProps {
  onDelete?: () => void;
}
const ItemEditIcon = ({onDelete}: ItemEditIconProps) => {
  const onEdit = () => {};
  const onDeleteHandler = async () => {
    if (onDelete) {
      onDelete();
    }
  };
  return (
    <View style={styles.container}>
      <PressableObacity onPress={onEdit}>
        <Icon
          // style={styles.errorIcon}
          name="pencil-outline"
          // color="#F2A39C"
          color={theme.colors.grey}
          size={25}
        />
      </PressableObacity>
      <PressableObacity onPress={onDeleteHandler}>
        <Icon
          // style={styles.errorIcon}
          name="trash-can-outline"
          // color="#F2A39C"
          color={theme.colors.grey}
          size={25}
        />
      </PressableObacity>
    </View>
  );
};

export default React.memo(ItemEditIcon);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

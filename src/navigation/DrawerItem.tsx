import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {Text} from '../components/core';
import Icon from '../components/core/Icon';
import PressableOpacity from '../components/core/PressableOpacity';
import theme from '../styles/theme';

interface DrawerItemProps {
  label: string;
  onPress: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}
const DrawerItem = ({
  label,
  icon,
  style,
  iconStyle,
  labelStyle,
  onPress,
}: DrawerItemProps) => {
  return (
    <PressableOpacity onPress={onPress} style={[styles.container, style]}>
      {icon ? (
        <Icon
          name={icon}
          size={20}
          color={theme.colors.dark}
          style={[styles.icon, styles.emptyIcon, iconStyle]}
        />
      ) : (
        <View style={styles.emptyIcon} />
      )}
      <Text style={[styles.itemText, labelStyle]}>{label}</Text>
    </PressableOpacity>
  );
};

export default React.memo(DrawerItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    // borderBottomColor: theme.colors.lightGrey,
    // borderBottomWidth: 2,
    height: 50,
  },
  icon: {
    // backgroundColor: 'grey',
  },
  emptyIcon: {
    marginRight: 10,
  },
  itemText: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
  },
});

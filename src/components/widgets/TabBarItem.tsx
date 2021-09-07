import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import theme from '../../styles/theme';
import {Icon} from '../core';
import PressableOpacity from '../core/PressableOpacity';

interface TabBarItemProps {
  label?: string;
  icon?: string;
  iconStyle?: StyleProp<TextStyle>;
  badge?: number;
  style?: StyleProp<ViewStyle>;
  isFocused?: boolean;
  onPress?: () => void;
}
const TabBarItem = ({
  label,
  icon,
  badge,
  iconStyle,
  isFocused,
  onPress,
  ...props
}: TabBarItemProps) => {
  // const route: any = state.routes.find(() => route.name === name);

  return (
    <PressableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      onPress={onPress}
      style={[styles.container, props.style as ViewStyle]}>
      {!!badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      {!!icon && (
        <Icon
          name={icon}
          color={isFocused ? theme.colors.green : theme.colors.dark}
          size={24}
          style={[styles.icon, iconStyle]}
        />
      )}
      {!!label && (
        <Text style={[styles.label, isFocused ? styles.labelFocused : {}]}>
          {label}
        </Text>
      )}
    </PressableOpacity>
  );
};

export default React.memo(TabBarItem);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 50,
    // borderColor: 'grey',
    // borderWidth: 1,
  },
  label: {
    color: theme.colors.dark,
    ...theme.styles.scale.body4,
  },
  labelFocused: {
    color: theme.colors.dark,
  },
  icon: {
    fontWeight: '500',
  },
  iconFocused: {
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 1,
    width: 20,
    height: 20,
    backgroundColor: theme.colors.salmon,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...theme.styles.scale.body4,
    color: theme.colors.white,
  },
});

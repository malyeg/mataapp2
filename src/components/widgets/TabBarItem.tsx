import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../styles/theme';
import PressableObacity from '../core/PressableObacity';

interface TabBarItemProps extends BottomTabBarProps<BottomTabBarOptions> {
  name: string;
  label?: string;
  icon?: string;
  iconStyle?: StyleProp<TextStyle>;
  badge?: number;
}
const TabBarItem: FC<TabBarItemProps> = ({
  name,
  label,
  icon,
  navigation,
  state,
  descriptors,
  badge,
  ...props
}) => {
  // const route: any = state.routes.find(() => route.name === name);
  const routeIndex = state.routes.findIndex(route => route.name === name);
  const route = state.routes[routeIndex];
  const {options} = descriptors[route.key];
  const isFocused = state.index === routeIndex;
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };
  return (
    <PressableObacity
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
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
          style={[styles.icon, props.iconStyle]}
        />
      )}
      {!!label && (
        <Text style={[styles.label, isFocused ? styles.labelFocused : {}]}>
          {label}
        </Text>
      )}
    </PressableObacity>
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
    right: 5,
    width: 15,
    height: 15,
    backgroundColor: theme.colors.salmon,
    borderRadius: 7.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...theme.styles.scale.body4,
    color: theme.colors.white,
  },
});

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import theme from '../../styles/theme';
import {Icon, Text} from '../core';
import {IconProps} from '../core/Icon';
import HeaderNav from './HeaderNav';

export interface MenuItem {
  label: string;
  onPress?: () => void;
  icon?: IconProps;
}
interface HeaderProps {
  title?: string;
  navigation: any;
  route: any;
  options?: any;
  menu?: {
    items: MenuItem[];
  };
}
const Header = ({title, options, route, menu, ...props}: HeaderProps) => {
  return (
    <>
      <View style={styles.container}>
        <HeaderNav style={styles.nav} route={route} {...props} />
        <Text style={styles.title} h5 numberOfLines={1}>
          {title ??
            (route?.params as {title: string})?.title ??
            options?.headerTitle ??
            route.name}
        </Text>
        {menu && (
          <Menu style={styles.menuContainer}>
            <MenuTrigger>
              <Icon
                name="more"
                type="svg"
                style={styles.moreIcon}
                // size={20}
                color={theme.colors.dark}
              />
            </MenuTrigger>
            <MenuOptions>
              {menu.items.map((item, index) => (
                <MenuOption
                  key={index}
                  onSelect={item.onPress}
                  style={styles.menuItem}>
                  {!!item.icon && (
                    <Icon
                      {...item.icon}
                      style={[styles.menuItemIcon, item.icon.style]}
                    />
                  )}
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </MenuOption>
              ))}
            </MenuOptions>
          </Menu>
        )}
      </View>
    </>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // height: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  title: {
    // flex: 1,
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
  },
  nav: {
    position: 'absolute',
    left: 0,
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
  },
  menuContainer: {
    position: 'absolute',
    // top: 0,
    right: 0,
    // width: 200,
    // height: 200,
    // backgroundColor: 'red',
    // alignSelf: 'flex-end',
  },
  moreIcon: {
    marginRight: 20,
  },
  menuItem: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingVertical: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 20,
  },
  menuItemIcon: {
    // position: 'absolute',
    // left: 5,
  },
});

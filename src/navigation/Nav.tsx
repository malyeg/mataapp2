import {DrawerNavigationOptions} from '@react-navigation/drawer';
import {StackNavigationOptions} from '@react-navigation/stack';
import React from 'react';
import HeaderNav from '../components/widgets/HeaderNav';
import theme from '../styles/theme';

const screenOptions: StackNavigationOptions = {
  headerTitleAlign: 'center',
  headerLeft: props => <HeaderNav {...props} />,
  headerTitleContainerStyle: {},
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
  },
  // headerTransparent: true,
  headerTitleStyle: {
    fontWeight: theme.fontWeight.semiBold,
    ...theme.styles.scale.h5,
    color: theme.colors.salmon,
  },
};

const drawerOptions: DrawerNavigationOptions = {
  headerShown: true,
  headerTitleAlign: 'center',
  headerLeft: props => <HeaderNav {...props} />,
  // headerTitleContainerStyle: {},
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
  },
  // headerTransparent: true,
  headerTitleStyle: {
    fontWeight: theme.fontWeight.semiBold,
    ...theme.styles.scale.h5,
    color: theme.colors.salmon,
  },
};

export {screenOptions, drawerOptions};

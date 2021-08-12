import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import React from 'react';
import Header from '../components/widgets/Header';
import {stacks} from '../config/constants';
import DrawerContent from './DrawerContent';
import HomeStack from './HomeStack';

export type StackParams = {
  // [screens.HOME_TABS]: undefined;
  [stacks.HOME_STACK]: undefined;
};

const drawerOptions: DrawerNavigationOptions = {
  headerShown: true,
  header: props => (
    <Header title={props.options.headerTitle as string} {...props} />
  ),
};

const Drawer = createDrawerNavigator<StackParams>();

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={drawerOptions}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name={stacks.HOME_STACK}
        component={HomeStack}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;

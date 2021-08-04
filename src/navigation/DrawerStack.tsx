import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import React from 'react';
import Header from '../components/widgets/Header';
import {screens, stacks} from '../config/constants';
import useLocale from '../hooks/useLocale';
import AddItemScreen from '../screens/AddItemScreen';
import FAQScreen from '../screens/FAQScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DealsStack from './DealsStack';
import DrawerContent from './DrawerContent';
import HomeTabs from './HomeTabs';
import ItemsStack from './ItemsStack';
import ProfileStack from './ProfileStack';

export type StackParams = {
  [screens.HOME_TABS]: undefined;
  [screens.PROFILE_STACK]: undefined;
  [stacks.ITEMS_STACK]: undefined;
  [stacks.DEALS_STACK]: undefined;
  [screens.ADD_ITEM]: undefined;
  [screens.FAQ]: undefined;
  [screens.SETTINGS]: undefined;
  [screens.NOTIFICATIONS]: undefined;
};

const drawerOptions: DrawerNavigationOptions = {
  headerShown: true,
  header: props => (
    <Header title={props.options.headerTitle as string} {...props} />
  ),
};

const Drawer = createDrawerNavigator<StackParams>();

const DrawerStack = () => {
  const {t} = useLocale('common');

  return (
    <Drawer.Navigator
      screenOptions={drawerOptions}
      // initialRouteName={screens.HOME_TABS}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name={screens.HOME_TABS}
        component={HomeTabs}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name={stacks.DEALS_STACK}
        component={DealsStack}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name={screens.PROFILE_STACK}
        component={ProfileStack}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name={stacks.ITEMS_STACK}
        component={ItemsStack}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name={screens.ADD_ITEM}
        component={AddItemScreen}
        options={{headerTitle: t('screens.addItem')}}
      />
      <Drawer.Screen
        name={screens.SETTINGS}
        component={SettingsScreen}
        options={{headerTitle: t('screens.settings')}}
      />
      <Drawer.Screen
        name={screens.NOTIFICATIONS}
        component={NotificationsScreen}
        options={{headerTitle: t('screens.notifications')}}
      />
      <Drawer.Screen
        name={screens.FAQ}
        component={FAQScreen}
        options={{headerTitle: t('screens.faq')}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;

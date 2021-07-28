import {getFocusedRouteNameFromRoute} from '@react-navigation/core';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {ConditionType, ItemStatus, SwapType} from '../api/itemsApi';
import {screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import AddItemScreen from '../screens/AddItemScreen';
import DealDetailsScreen from '../screens/DealDetailsScreen';
import FAQScreen from '../screens/FAQScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import ItemsScreen from '../screens/ItemsScreen';
import MyItemsScreen from '../screens/MyItemsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DealsTabs from './DealsTabs';
import DrawerContent from './DrawerContent';
import HomeTabs from './HomeTabs';
import {drawerOptions} from './Nav';

export type StackParams = {
  [screens.HOME_TABS]: undefined;

  [screens.PROFILE]: undefined;
  [screens.EDIT_PROFILE]: undefined;
  [screens.CHANGE_PASSWORD]: undefined;

  [screens.ADD_ITEM]: undefined;
  [screens.ITEMS]:
    | {
        categoryId: string;
        lastRefresh: number;
        userId: string;
        swapType: SwapType;
        status: ItemStatus;
        conditionType: ConditionType;
        city: string;
      }
    | undefined;
  [screens.ITEM_DETAILS]: {id: string; title: string} | undefined;
  [screens.MY_ITEMS]: {lastRefresh: number} | undefined;

  [screens.DEALS_TABS]: undefined;
  [screens.DEAL_DETAILS]: {id: string; toastType: string} | undefined;

  [screens.FAQ]: undefined;
  [screens.SETTINGS]: undefined;
  [screens.NOTIFICATIONS]: undefined;
};

export type ItemDetailsRouteProp = RouteProp<
  StackParams,
  typeof screens.ITEM_DETAILS
>;
export type DealDetailsRouteProp = RouteProp<
  StackParams,
  typeof screens.DEAL_DETAILS
>;
export type MyItemsRouteProp = RouteProp<StackParams, typeof screens.MY_ITEMS>;
export type ItemsRouteProp = RouteProp<StackParams, typeof screens.ITEMS>;

const Drawer = createDrawerNavigator<StackParams>();

const DrawerStack = () => {
  const {t} = useLocale('common');

  function getHeaderTitle(route: any) {
    const routeName = getFocusedRouteNameFromRoute(route);
    console.log('routeName', routeName);
    switch (routeName) {
      case screens.DEALS_TABS:
        return t('tabBar.dealsTitle');
      case screens.NOTIFICATIONS:
        return t('tabBar.notificationsTitle');
      case screens.MY_ITEMS:
        return t('tabBar.myItemsTitle');
    }
  }

  return (
    <Drawer.Navigator
      drawerType="slide"
      screenOptions={drawerOptions}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name={screens.HOME_TABS}
        component={HomeTabs}
        options={({route}) => ({
          headerTitle: getHeaderTitle(route),
          headerShown: getFocusedRouteNameFromRoute(route) !== screens.HOME,
          drawerLabel: t('drawer.homeLabel'),
          // headerLeft: () => null,
        })}
      />
      <Drawer.Screen
        name={screens.PROFILE}
        component={ProfileScreen}
        options={{
          headerTitle: t('screens.profile'),
          drawerLabel: t('drawer.profileLabel'),
        }}
      />
      <Drawer.Screen
        name={screens.ITEMS}
        component={ItemsScreen}
        options={{
          headerTitle: t('screens.items'),
          drawerLabel: t('drawer.itemsLabel'),
        }}
      />
      <Drawer.Screen
        name={screens.MY_ITEMS}
        component={MyItemsScreen}
        options={{
          headerTitle: t('screens.myItems'),
          drawerLabel: t('drawer.myItemsLabel'),
        }}
      />
      <Drawer.Screen
        name={screens.ITEM_DETAILS}
        component={ItemDetailsScreen}
        options={({route}) => ({
          headerTitle: (route.params as any)?.title ?? t('screens.itemDetails'),
          drawerLabel: t('drawer.itemDetailsLabel'),
        })}
      />
      <Drawer.Screen
        name={screens.ADD_ITEM}
        component={AddItemScreen}
        options={{
          headerTitle: t('screens.addItem'),
          // drawerLabel: t('drawer.itemsLabel'),
        }}
      />

      <Drawer.Screen
        name={screens.DEALS_TABS}
        component={DealsTabs}
        options={{headerTitle: t('screens.deals')}}
      />
      <Drawer.Screen
        name={screens.DEAL_DETAILS}
        component={DealDetailsScreen}
        options={{headerTitle: t('screens.dealDetails')}}
      />

      <Drawer.Screen
        name={screens.SETTINGS}
        component={SettingsScreen}
        options={{
          headerTitle: t('screens.settings'),
          drawerLabel: t('drawer.settingsLabel'),
        }}
      />
      <Drawer.Screen
        name={screens.NOTIFICATIONS}
        component={NotificationsScreen}
        options={{
          headerTitle: t('screens.notifications'),
          drawerLabel: t('drawer.notificationsLabel'),
        }}
      />
      <Drawer.Screen
        name={screens.FAQ}
        component={FAQScreen}
        options={{
          headerTitle: t('screens.faq'),
          drawerLabel: t('drawer.faqLabel'),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;

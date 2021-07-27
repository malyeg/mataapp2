import React, {useCallback} from 'react';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import AddItemScreen from '../screens/AddItemScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import DealDetailsScreen from '../screens/DealDetailsScreen';
import EditProfileScreen, {
  EDIT_PROFILE_SCREEN_NAME,
} from '../screens/EditProfileScreen';
import ItemDetailsScreen, {
  ITEM_DETAILS_SCREEN_NAME,
} from '../screens/ItemDetailsScreen';
import ItemsScreen from '../screens/ItemsScreen';
import MyItemsScreen, {MY_ITEMS_SCREEN} from '../screens/MyItemsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ThemeScreen from '../screens/ThemeScreen';
import DealsTabs from './DealsTabs';
import HomeTabs, {HOME_TABS} from './HomeTabs';
import {screenOptions} from './Nav';

export type StackParams = {
  HomeTabs: undefined;
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  ChangePasswordScreen: undefined;
  AddItemScreen: undefined;
  [screens.ITEMS]: {categoryId: string; lastRefresh: number} | undefined;
  ItemDetailsScreen: {id: string; title: string} | undefined;
  [screens.DEAL_DETAILS_SCREEN]: {id: string; toastType: string} | undefined;
  [screens.DEALS_TABS]: undefined;
  MyItemsScreen: {lastRefresh: number} | undefined;
  ThemeScreen: undefined;
};
const DEAL_DETAILS_SCREEN = screens.DEAL_DETAILS_SCREEN;
export type ItemDetailsRouteProp = RouteProp<StackParams, 'ItemDetailsScreen'>;
export type DealDetailsRouteProp = RouteProp<
  StackParams,
  typeof screens.DEAL_DETAILS_SCREEN
>;
export type MyItemsRouteProp = RouteProp<StackParams, 'MyItemsScreen'>;
export type ItemsRouteProp = RouteProp<StackParams, 'ItemsScreen'>;

const stack = createStackNavigator<StackParams>();

const HomeStack = () => {
  const {t} = useLocale('common');

  function getHeaderTitle(route: any) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route);
    console.log('routeName', routeName);
    switch (routeName) {
      case screens.DEALS_TABS:
        return t('tabBar.dealsTitle');
      case screens.NOTIFICATIONS:
        return t('tabBar.notificationsTitle');
      case screens.MY_ITEMS_SCREEN:
        return t('tabBar.myItemsTitle');
    }
  }

  const detailsOptions = useCallback(
    ({route}: {route: ItemDetailsRouteProp}) => ({
      headerTitle: route.params?.title ?? t('screens.itemDetails'),
    }),
    [t],
  );

  return (
    <stack.Navigator screenOptions={screenOptions}>
      <stack.Screen
        name={HOME_TABS}
        component={HomeTabs}
        // options={{headerShown: false}}
        options={({route}) => ({
          headerTitle: getHeaderTitle(route),
          headerShown: getFocusedRouteNameFromRoute(route) !== screens.HOME,
        })}
      />
      <stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{headerTitle: t('screens.profile')}}
      />
      <stack.Screen
        name={EDIT_PROFILE_SCREEN_NAME}
        component={EditProfileScreen}
        options={{headerTitle: t('screens.editProfile')}}
      />
      <stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{headerTitle: t('screens.changePassword')}}
      />
      <stack.Screen
        name="AddItemScreen"
        component={AddItemScreen}
        options={{headerTitle: t('screens.addItem')}}
        // options={{headerShown: false}}
      />
      <stack.Screen
        name={MY_ITEMS_SCREEN}
        component={MyItemsScreen}
        options={{headerTitle: t('screens.myItems')}}
      />
      <stack.Screen
        name="ItemsScreen"
        component={ItemsScreen}
        options={{headerTitle: t('screens.items')}}
      />
      <stack.Screen
        name={screens.DEALS_TABS}
        component={DealsTabs}
        options={{headerTitle: t('screens.deals')}}
      />

      <stack.Screen
        name={screens.DEAL_DETAILS_SCREEN}
        component={DealDetailsScreen}
        options={{headerTitle: t('screens.dealDetails')}}
      />

      <stack.Screen
        name={ITEM_DETAILS_SCREEN_NAME}
        component={ItemDetailsScreen}
        options={detailsOptions}
      />

      <stack.Screen
        name="ThemeScreen"
        component={ThemeScreen}
        options={{headerTitle: 'Theme'}}
      />
    </stack.Navigator>
  );
};

export default React.memo(HomeStack);

import {RouteProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import useLocale from '../hooks/useLocale';
import AddItemScreen from '../screens/AddItemScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
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
import HomeTabs, {HOME_TABS} from './HomeTabs';
import {screenOptions} from './Nav';

export type StackParams = {
  HomeTabs: undefined;
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  ChangePasswordScreen: undefined;
  AddItemScreen: undefined;
  ItemsScreen: undefined;
  ItemDetailsScreen: {id: string; title: string} | undefined;
  MyItemsScreen: {refresh: boolean} | undefined;
  ThemeScreen: undefined;
};

export type ItemDetailsRouteProp = RouteProp<StackParams, 'ItemDetailsScreen'>;
export type MyItemsRouteProp = RouteProp<StackParams, 'MyItemsScreen'>;

const stack = createStackNavigator<StackParams>();

const HomeStack = () => {
  const {t} = useLocale('common');

  const detailsOptions = useCallback(
    ({route}: {route: ItemDetailsRouteProp}) => ({
      headerTitle: route.params?.title ?? t('screens.itemDetails'),
    }),
    [t],
  );
  return (
    <stack.Navigator
      screenOptions={screenOptions}
      // initialRouteName="HomeTabs"
      // initialRouteName={EDIT_PROFILE_SCREEN_NAME}
      // initialRouteName="ItemDetailsScreen"
      // initialRouteName="ThemeScreen" //
    >
      <stack.Screen
        name={HOME_TABS}
        component={HomeTabs}
        options={{headerShown: false}}
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
        name={ITEM_DETAILS_SCREEN_NAME}
        component={ItemDetailsScreen}
        options={detailsOptions}
      />
      {/* <stack.Screen
        name="ThemeScreen"
        component={ThemeScreen}
        options={{headerTitle: t('screens.addItem')}}
      /> */}
    </stack.Navigator>
  );
};

export default React.memo(HomeStack);

import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import {ItemStatus} from '../api/itemsApi';
import Header, {MenuItem} from '../components/widgets/Header';
import {screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import AddItemScreen from '../screens/AddItemScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import DealDetailsScreen from '../screens/DealDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FAQScreen from '../screens/FAQScreen';
import HomeScreen from '../screens/HomeScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import ItemsScreen from '../screens/ItemsScreen';
import MyItemsScreen from '../screens/MyItemsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SupportUsScreen from '../screens/SupportUsScreen';
import {Status} from '../types/DataTypes';
import DealsTabs from './DealsTabs';

const screenOptions: StackNavigationOptions = {
  headerShown: true,
  header: props => (
    <Header title={props.options.headerTitle as string} {...props} />
  ),
};

export type StackParams = {
  [screens.HOME]: undefined;
  [screens.ITEMS]:
    | {
        categoryId: string;
        swapType: string;
        conditionType: string;
        status: ItemStatus;
        userId: string;
        city: string;
      }
    | undefined;
  [screens.MY_ITEMS]: undefined;
  [screens.ADD_ITEM]: {id: string; title: string} | undefined;
  [screens.ITEM_DETAILS]:
    | {id: string; title: string; toast: Status}
    | undefined;

  [screens.PROFILE]: undefined;
  [screens.EDIT_PROFILE]: undefined;
  [screens.CHANGE_PASSWORD]: undefined;

  [screens.DEALS_TABS]: undefined;
  [screens.DEAL_DETAILS]: {id: string; title: string} | undefined;

  [screens.SETTINGS]: undefined;
  [screens.NOTIFICATIONS]: undefined;
  [screens.FAQ]: undefined;
  [screens.SUPPORT_US]: undefined;
};

const Stack = createStackNavigator<StackParams>();

const HomeStack = () => {
  const {t} = useLocale('common');
  // const {navigation} = useNavigationHelper();

  const archivedMenuItem: MenuItem = {
    label: t('Closed deals'),
    // icon: {name: 'delete'},
    onPress: () => {
      // navigation.navigate(screens.ARCHIVED_DEALS_TABS);
    },
  };
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={screens.HOME}>
      <Stack.Screen
        name={screens.HOME}
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={screens.PROFILE}
        component={ProfileScreen}
        options={{headerTitle: t('screens.profile')}}
      />
      <Stack.Screen
        name={screens.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{headerTitle: t('screens.editProfile')}}
      />
      <Stack.Screen
        name={screens.CHANGE_PASSWORD}
        component={ChangePasswordScreen}
        options={{headerTitle: t('screens.changePassword')}}
      />
      <Stack.Screen
        name={screens.ITEMS}
        component={ItemsScreen}
        options={{headerTitle: t('screens.items')}}
      />
      <Stack.Screen
        name={screens.MY_ITEMS}
        component={MyItemsScreen}
        options={{headerTitle: t('screens.myItems')}}
      />
      <Stack.Screen
        name={screens.ITEM_DETAILS}
        component={ItemDetailsScreen}
        initialParams={{title: t('screens.itemDetails')}}
      />
      <Stack.Screen
        name={screens.ADD_ITEM}
        component={AddItemScreen}
        initialParams={{title: t('screens.addItem')}}
      />

      <Stack.Screen
        name={screens.DEALS_TABS}
        component={DealsTabs}
        // options={{header headerTitle: t('screens.deals')}}
        options={{
          header: props => (
            <Header
              title={t('screens.deals')}
              menu={{items: [archivedMenuItem]}}
              {...props}
            />
          ),
        }}
      />
      <Stack.Screen
        name={screens.DEAL_DETAILS}
        component={DealDetailsScreen}
        options={{headerTitle: t('screens.dealDetails')}}
      />
      <Stack.Screen
        name={screens.SETTINGS}
        component={SettingsScreen}
        options={{headerTitle: t('screens.settings')}}
      />
      <Stack.Screen
        name={screens.NOTIFICATIONS}
        component={NotificationsScreen}
        options={{headerTitle: t('screens.notifications')}}
      />
      <Stack.Screen
        name={screens.FAQ}
        component={FAQScreen}
        options={{headerTitle: t('screens.faq')}}
      />
      <Stack.Screen
        name={screens.SUPPORT_US}
        component={SupportUsScreen}
        options={{headerTitle: t('screens.supportUs')}}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import TabBar from '../components/widgets/TabBar';
import useLocale from '../hooks/useLocale';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WishListScreen from '../screens/WishListScreen';

// import SystemScreen from '../screens/SystemScreen';
export const HOME_TABS = 'HomeTabs';
export type BottomTabParams = {
  HomeScreen: {title: string; icon: string} | undefined;
  NotificationsScreen: {title: string; icon: string} | undefined;
  WishListScreen: {title: string; icon: string} | undefined;
  SettingsScreen: {title: string; icon: string} | undefined;
};
const Tab = createBottomTabNavigator<BottomTabParams>();

const HomeTabs = () => {
  const {t} = useLocale('common');
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{title: t('tabBar.homeTitle'), icon: 'home-outline'}}
      />
      <Tab.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        initialParams={{
          title: t('tabBar.notificationsTitle'),
          icon: 'bell-outline',
        }}
      />
      <Tab.Screen
        name="WishListScreen"
        component={WishListScreen}
        initialParams={{
          title: t('tabBar.wishListTitle'),
          icon: 'heart-outline',
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        initialParams={{title: t('tabBar.settingsTitle'), icon: 'cog-outline'}}
      />
    </Tab.Navigator>
  );
};

export default React.memo(HomeTabs);

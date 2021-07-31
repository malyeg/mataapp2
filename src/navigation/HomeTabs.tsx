import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import TabBar from '../components/widgets/TabBar';
import {screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import HomeScreen from '../screens/HomeScreen';
import MyItemsScreen from '../screens/MyItemsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import DealsTabs from './DealsTabs';

// import SystemScreen from '../screens/SystemScreen';
export const HOME_TABS = 'HomeTabs';
export type BottomTabParams = {
  HomeScreen: {title: string; icon: string} | undefined;
  NotificationsScreen: {title: string; icon: string} | undefined;
  MyItemsScreen: {title: string; icon: string} | undefined;
  DealsTabs: {title: string; icon: string} | undefined;
};
const Tab = createBottomTabNavigator<BottomTabParams>();

const HomeTabs = () => {
  const {t} = useLocale('common');
  return (
    <Tab.Navigator
      initialRouteName={screens.HOME}
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name={screens.HOME}
        component={HomeScreen}
        initialParams={{title: t('tabBar.homeTitle'), icon: 'home-outline'}}
      />

      <Tab.Screen
        name={screens.NOTIFICATIONS}
        component={NotificationsScreen}
        initialParams={{
          title: t('tabBar.notificationsTitle'),
          icon: 'bell-outline',
        }}
      />
      <Tab.Screen
        name={screens.MY_ITEMS}
        component={MyItemsScreen}
        initialParams={{
          title: t('tabBar.myItemsTitle'),
          icon: 'view-list-outline',
        }}
      />
      <Tab.Screen
        name={screens.DEALS_TABS}
        component={DealsTabs}
        initialParams={{title: t('tabBar.dealsTitle'), icon: 'handshake'}}
      />
    </Tab.Navigator>
  );
};

export default React.memo(HomeTabs);

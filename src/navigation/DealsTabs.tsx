import {RouteProp} from '@react-navigation/core';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import IncomingDealsScreen from '../screens/IncomingDealsScreen';
import OutgoingDealsScreen from '../screens/OutgoingDealsScreen';
import theme from '../styles/theme';

const dealsTabsOptions: MaterialTopTabNavigationOptions = {
  lazy: true,
  tabBarIndicatorStyle: {backgroundColor: theme.colors.salmon},
};

export type StackParams = {
  [screens.OUTGOING_DEALS]: {archived: boolean} | undefined;
  [screens.INCOMING_DEALS]: {archived: boolean} | undefined;
};
export type OutgoingDealsRoute = RouteProp<
  StackParams,
  typeof screens.OUTGOING_DEALS
>;
export type IngoingDealsRoute = RouteProp<
  StackParams,
  typeof screens.INCOMING_DEALS
>;
const Tab = createMaterialTopTabNavigator<StackParams>();

const DealsTabs = () => {
  const {t} = useLocale('common');
  return (
    <Tab.Navigator screenOptions={dealsTabsOptions}>
      <Tab.Screen
        name={screens.OUTGOING_DEALS}
        component={OutgoingDealsScreen}
        options={{tabBarLabel: t('screens.outgoingDeals')}}
      />
      <Tab.Screen
        name={screens.INCOMING_DEALS}
        component={IncomingDealsScreen}
        options={{tabBarLabel: t('screens.incomingDeals')}}
      />
    </Tab.Navigator>
  );
};

export default DealsTabs;

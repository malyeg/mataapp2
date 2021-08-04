import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import IncomingDealsScreen from '../screens/IncomingDealsScreen';
import OutgoingDealsScreen from '../screens/OutgoingDealsScreen';
import theme from '../styles/theme';

const dealsTabsOptions: MaterialTopTabNavigationOptions = {
  lazy: true,
  tabBarIndicatorStyle: {backgroundColor: theme.colors.salmon},
};
const Tab = createMaterialTopTabNavigator();

const DealsTabs = () => {
  return (
    <Tab.Navigator screenOptions={dealsTabsOptions}>
      <Tab.Screen name="Outgoing" component={OutgoingDealsScreen} />
      <Tab.Screen name="Incoming" component={IncomingDealsScreen} />
    </Tab.Navigator>
  );
};

export default DealsTabs;

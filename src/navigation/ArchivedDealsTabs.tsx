import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import useLocale from '../hooks/useLocale';
import IncomingDealsScreen from '../screens/IncomingDealsScreen';
import OutgoingDealsScreen from '../screens/OutgoingDealsScreen';
import theme from '../styles/theme';

const dealsTabsOptions: MaterialTopTabNavigationOptions = {
  lazy: true,
  tabBarIndicatorStyle: {backgroundColor: theme.colors.salmon},
};
const Tab = createMaterialTopTabNavigator();

const ArchivedDealsTabs = () => {
  const {t} = useLocale('common');
  return (
    <Tab.Navigator screenOptions={dealsTabsOptions}>
      <Tab.Screen
        name="Outgoing"
        component={OutgoingDealsScreen}
        initialParams={{archived: true}}
        options={{tabBarLabel: t('screens.outgoingDeals')}}
      />
      <Tab.Screen
        name="Incoming"
        component={IncomingDealsScreen}
        initialParams={{archived: true}}
        options={{tabBarLabel: t('screens.incomingDeals')}}
      />
    </Tab.Navigator>
  );
};

export default ArchivedDealsTabs;

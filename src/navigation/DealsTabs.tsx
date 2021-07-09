import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet} from 'react-native';
import IncomingDealsScreen from '../screens/IncomingDealsScreen';
import OutgoingDealsScreen from '../screens/OutgoingDealsScreen';
import theme from '../styles/theme';

const Tab = createMaterialTopTabNavigator();

const DealsTabs = () => {
  return (
    <Tab.Navigator
      lazy
      tabBarOptions={{
        indicatorStyle: styles.indicatorStyle,
      }}>
      <Tab.Screen name="Outgoing" component={OutgoingDealsScreen} />
      <Tab.Screen name="Incoming" component={IncomingDealsScreen} />
    </Tab.Navigator>
  );
};

export default DealsTabs;

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: theme.colors.salmon,
  },
});

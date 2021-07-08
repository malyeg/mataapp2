import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet} from 'react-native';
import DealsScreen from '../screens/DealsScreen';
import MyDealsScreen from '../screens/MyDealsScreen';

const Tab = createMaterialTopTabNavigator();

const DealsTabs = () => {
  return (
    <Tab.Navigator lazy>
      <Tab.Screen name="Outgoing" component={MyDealsScreen} />
      <Tab.Screen name="Incoming" component={DealsScreen} />
    </Tab.Navigator>
  );
};

export default DealsTabs;

const styles = StyleSheet.create({});

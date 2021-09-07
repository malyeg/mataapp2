import React from 'react';
import {Text} from 'react-native';
import {Screen} from '../components/core';
import ItemsSearch from '../components/widgets/ItemsSearch';

const SettingsScreen = () => {
  return (
    <Screen>
      {/* <Text>SettingsScreen</Text> */}
      <ItemsSearch />
    </Screen>
  );
};

export default SettingsScreen;

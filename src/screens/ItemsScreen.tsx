import React from 'react';
import {StyleSheet} from 'react-native';
import {Screen, Text} from '../components/core';

export const ITEMS_SCREEN = 'ItemsScreen';
const ItemsScreen = () => {
  return (
    <Screen scrollable={false}>
      <Text>Items screen</Text>
    </Screen>
  );
};

export default ItemsScreen;

const styles = StyleSheet.create({});

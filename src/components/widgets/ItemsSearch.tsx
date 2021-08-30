import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import SearchInput from '../form/SearchInput';

interface ItemsSearchProps {
  style?: StyleProp<ViewStyle>;
}
const ItemsSearch = ({style}: ItemsSearchProps) => {
  return (
    <View style={style}>
      <SearchInput placeholder="Search" />
    </View>
  );
};

export default ItemsSearch;

const styles = StyleSheet.create({});

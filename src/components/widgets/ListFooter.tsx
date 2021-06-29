import React from 'react';
import {ActivityIndicator, StyleSheet, View, ViewProps} from 'react-native';
import theme from '../../styles/theme';

interface ItemListFooterProps extends ViewProps {
  horizontal?: boolean;
}
const ListFooter = ({horizontal, style}: ItemListFooterProps) => {
  return (
    <View
      style={[styles.container, horizontal ? styles.horizontal : {}, style]}>
      <ActivityIndicator color={theme.colors.salmon} size="large" />
    </View>
  );
};

export default ListFooter;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  horizontal: {
    // flex: 0,
  },
});

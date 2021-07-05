import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Item} from '../../api/itemsApi';
import Swap from '../../assets/svgs/icSwap.svg';
import theme from '../../styles/theme';
import {Text} from '../core';

interface SwapIconProps extends ViewProps {
  item: Item;
  onPress?: () => void;
  iconSize?: number;
}
const SwapIcon = ({item, iconSize = 15, style}: SwapIconProps) => {
  return (
    <View style={[styles.container, style]}>
      <Swap width={iconSize} height={iconSize} fill={theme.colors.salmon} />
      {!!item && (
        <Text style={styles.offersText}>
          {isNaN(item.offers) ? 0 : item.offers}
        </Text>
      )}
    </View>
  );
};

export default SwapIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 12,
    height: 25,
    paddingHorizontal: 7,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    // width: 50,
  },
  offersText: {
    ...theme.styles.scale.body2,
    paddingLeft: 5,
  },
});

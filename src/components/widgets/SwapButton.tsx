import React from 'react';
import {Pressable, PressableProps} from 'react-native';
import {Item} from '../../api/itemsApi';
import SwapIcon from './SwapIcon';

interface SwapbuttonProps extends PressableProps {
  item: Item;
  onPress?: () => void;
}
const SwapButton = ({
  item,
  onPress,
  hitSlop = 15,
  ...props
}: SwapbuttonProps) => {
  return (
    <Pressable onPress={onPress} hitSlop={hitSlop} {...props}>
      <SwapIcon item={item} />
    </Pressable>
  );
};

export default React.memo(SwapButton);

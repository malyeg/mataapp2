import {useKeyboard} from '@react-native-community/hooks';
import React, {FC} from 'react';
import {View, ViewProps} from 'react-native';

const KeyboardView: FC<ViewProps> = props => {
  const {keyboardShown} = useKeyboard();
  return <View {...props}>{!keyboardShown && props.children}</View>;
};

export default KeyboardView;

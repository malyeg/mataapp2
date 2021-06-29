import React, {useCallback} from 'react';
import {GestureResponderEvent, StyleSheet, TextStyle} from 'react-native';
import theme, {ColorProps} from '../../styles/theme';
import PressableObacity, {PressableOpacityProps} from './PressableObacity';
import Text from './Text';

// interface AppButtonProps extends ButtonProps {}

export interface ButtonProps extends ColorProps, PressableOpacityProps {
  title: string;
  icon?: string;
  metaData?: {[key: string]: unknown};
  textStyle?: TextStyle;
}

const AppButton = ({disabled, textStyle, onPress, ...props}: ButtonProps) => {
  const title = props.title ?? props.children;

  const onPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      if (onPress && !disabled) {
        onPress(event);
      }
    },
    [disabled, onPress],
  );

  const styleList = [
    styles.container,
    disabled ? styles.disabled : null,
    props.style,
  ];
  const styleTextList = [styles.text, textStyle];
  return (
    <PressableObacity
      {...props}
      onPress={onPressHandler}
      disabled={disabled}
      style={styleList}>
      <Text button style={styleTextList}>
        {title}
      </Text>
    </PressableObacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.salmon,
    // width: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 66,
  },
  text: {
    color: theme.colors.white,
  },
  disabled: {
    backgroundColor: theme.colors.pink,
  },
});

export default React.memo(AppButton);

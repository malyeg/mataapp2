import React, {useCallback} from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import theme, {ColorProps} from '../../styles/theme';
import PressableOpacity, {PressableOpacityProps} from './PressableOpacity';
import Text from './Text';

// interface AppButtonProps extends ButtonProps {}

export interface ButtonProps extends ColorProps, PressableOpacityProps {
  title: string;
  icon?: string;
  themeType?: 'primary' | 'secondary' | 'dark' | 'white';
  metaData?: {[key: string]: unknown};
  textStyle?: StyleProp<TextStyle>;
}

const AppButton = ({
  disabled,
  themeType = 'primary',
  textStyle,
  onPress,
  ...props
}: ButtonProps) => {
  const title = props.title ?? props.children;

  const onPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      if (onPress && !disabled) {
        onPress(event);
      }
    },
    [disabled, onPress],
  );

  const themeStyle = styles[themeType] ?? {};
  const themeTextStyle =
    themeType === 'white' ? styles.darkText : styles.whiteText;

  const styleList = [
    styles.container,
    disabled ? styles.disabled : null,
    props.style as StyleProp<ViewStyle>,
    themeStyle ? themeStyle : {},
  ];
  const styleTextList = [styles.text, themeTextStyle, textStyle];
  return (
    <PressableOpacity
      {...props}
      onPress={onPressHandler}
      disabled={disabled}
      style={styleList}>
      <Text button style={styleTextList}>
        {title}
      </Text>
    </PressableOpacity>
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
  dark: {
    backgroundColor: theme.colors.dark,
  },
  primary: {
    backgroundColor: theme.colors.salmon,
  },
  secondary: {
    backgroundColor: theme.colors.dark,
  },
  white: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
  },
  darkText: {
    color: theme.colors.dark,
  },
  whiteText: {
    color: theme.colors.white,
  },
});

export default React.memo(AppButton);

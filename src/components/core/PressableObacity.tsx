import React, {useCallback} from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import theme from '../../styles/theme';

export interface PressableOpacityProps extends PressableProps {
  /**
   * The opacity to use when `disabled={true}`
   *
   * @default 0.3
   */
  disabledOpacity?: number;
  /**
   * The opacity to animate to when the user presses the button
   *
   * @default 0.2
   */
  activeOpacity?: number;
}
export type StyleType = (
  state: PressableStateCallbackType,
) => StyleProp<ViewStyle>;
const PressableObacity = ({
  children,
  style,
  disabled = false,
  disabledOpacity = 0.6,
  activeOpacity = 0.2,
  onPress,
  ...props
}: PressableOpacityProps) => {
  const getOpacity = useCallback(
    (pressed: boolean) => {
      if (disabled) {
        return disabledOpacity;
      } else {
        if (pressed) {
          return activeOpacity;
        } else {
          return 1;
        }
      }
    },
    [activeOpacity, disabled, disabledOpacity],
  );

  const _style = useCallback<StyleType>(
    ({pressed}: PressableStateCallbackType) => [
      style as ViewStyle,
      {opacity: Platform.OS === 'ios' ? getOpacity(pressed) : 1},
      // {opacity: 1},
    ],
    [getOpacity, style],
  );

  const rippleConfig = {color: theme.colors.white};
  return (
    <Pressable
      {...props}
      style={_style}
      android_ripple={rippleConfig}
      onPress={onPress}>
      {children}
    </Pressable>
  );
};

export default React.memo(PressableObacity);

// const styles = StyleSheet.create({});

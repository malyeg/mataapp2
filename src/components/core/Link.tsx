import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import theme, {LinkProps} from '../../styles/theme';
import PressableOpacity from './PressableOpacity';
import Text from './Text';

const Link: FC<LinkProps> = ({onPress, style, textStyle, scale, ...props}) => {
  return (
    <PressableOpacity {...props} style={[styles.container, style]}>
      <Text
        {...props}
        scale={scale}
        onPress={onPress}
        style={[styles.text, textStyle]}>
        {props.children}
      </Text>
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '100%',
  },
  text: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.green,
  },
});

export default React.memo(Link);

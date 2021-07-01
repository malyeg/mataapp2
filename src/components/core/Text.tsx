import React, {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import theme, {
  ETextProps,
  getScaleStyle,
  getScaleStyleFromProps,
} from '../../styles/theme';
// type AppTextProps = TextProps & OnlyOne<ScaleProps>;

const AppText: FC<ETextProps> = ({scale, style, ...props}) => {
  const styleList = [
    styles.text,
    getScaleStyleFromProps(props),
    getScaleStyle(scale),
    style,
  ];
  return (
    <Text {...props} style={styleList}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...theme.styles.scale.body1,
    color: theme.colors.dark,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});

export default React.memo(AppText);

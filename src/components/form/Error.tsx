import React, {FC} from 'react';
import {FieldError as FieldErrorBase} from '../../types/DataTypes';
import {StyleSheet, TextStyle, View, ViewProps} from 'react-native';
import useLocale from '../../hooks/useLocale';
import theme from '../../styles/theme';
import Text from '../core/Text';
import {Icon} from '../core';

interface FieldErrorProps extends ViewProps {
  name?: string;
  error: FieldErrorBase;
  errorStyle?: TextStyle;
}
const Error: FC<FieldErrorProps> = ({name, error, errorStyle, ...props}) => {
  const {t} = useLocale('error');
  return error ? (
    <View {...props} style={[styles.container, props.style]}>
      <Icon
        name="alert-circle-outline"
        size={20} // TODO change to responsive
        color={theme.colors.salmon}
      />
      <Text
        body3
        testID={name ? name + '_error' : undefined}
        style={[styles.text, errorStyle]}>
        {error.code ? t(error.code, error.params) : error.message}
      </Text>
    </View>
  ) : null;
};

export default React.memo(Error);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 25,
  },
  text: {
    color: theme.colors.salmon,
    paddingLeft: 5,
  },
});

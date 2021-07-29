import React, {useCallback} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import useController from '../../hooks/userController';
import theme from '../../styles/theme';
import {FormProps} from '../../types/DataTypes';
import {Text} from '../core';
import PressableOpacity from '../core/PressableOpacity';
import Error from './Error';

interface RadioProps extends FormProps {
  options: {id: string; label: string}[];
  radioSize?: number;
  onChange?: (value: string) => void;
  horizontal?: boolean;
  groupStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
}
const RadioGroup = ({
  name,
  options,
  control,
  defaultValue,
  onChange,
  horizontal = false,
  radioSize = 25,
  groupStyle,
  containerStyle,
  labelStyle,
  label,
}: RadioProps) => {
  const {field, formState} = useController({
    control,
    defaultValue,
    name,
  });
  const onPressHandler = useCallback(
    (id: string) => {
      console.log(id);
      field.onChange(id);
      if (onChange) {
        onChange(id);
      }
    },
    [field, onChange],
  );

  const innerCircle = radioSize * 0.7;
  return (
    <View style={[containerStyle]}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.container,
          groupStyle,
          horizontal ? styles.horizontal : {},
        ]}>
        {options.map(item => (
          <PressableOpacity
            style={styles.radioContainer}
            key={item.id}
            onPress={() => onPressHandler(item.id)}>
            <View
              style={[
                styles.outerCircle,
                {
                  width: radioSize,
                  height: radioSize,
                  borderRadius: radioSize / 2,
                },
              ]}>
              <View
                style={[
                  styles.innerCircle,
                  {
                    width: innerCircle,
                    height: innerCircle,
                    borderRadius: innerCircle / 2,
                  },
                  item.id === field.value ? styles.active : {},
                ]}
              />
            </View>
            <Text>{item.label}</Text>
          </PressableOpacity>
        ))}
      </View>
      <Error error={formState.errors[name]} />
    </View>
  );
};

export default React.memo(RadioGroup);

const styles = StyleSheet.create({
  container: {
    // flexWrap: 'wrap',
  },
  horizontal: {
    flexDirection: 'row',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outerCircle: {
    borderWidth: 1,
    borderColor: theme.colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  innerCircle: {
    borderColor: theme.colors.grey,
  },
  active: {
    backgroundColor: theme.colors.salmon,
  },
  label: {
    marginBottom: 5,
  },
});

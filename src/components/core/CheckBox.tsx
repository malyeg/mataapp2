import React, {FC, useCallback, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import theme from '../../styles/theme';
import {Icon, Text} from '../core';
interface CheckBoxProps {
  size?: number;
  boxType?: 'square' | 'circle';
  value?: boolean | undefined;
  label?: string;
  onChange?: (v: boolean) => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}
const CheckBox: FC<CheckBoxProps> = ({
  size = 22,
  boxType = 'square',
  label,
  selected = false,
  onChange,
  style,
}) => {
  const [isSelected, setSelected] = useState(selected);
  const selectedIcon =
    boxType === 'square' ? 'checkbox-marked' : 'checkbox-marked-circle';
  const emptyIcon =
    boxType === 'square'
      ? 'checkbox-blank-outline'
      : 'checkbox-blank-circle-outline';

  const onToggle = useCallback(() => {
    console.log('onToggle');
    setSelected(v => {
      if (onChange) {
        onChange(!v);
      }
      return !v;
    });
  }, [onChange]);

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.container, styles.checkBoxContainer, style]}>
      <Icon
        name={isSelected ? selectedIcon : emptyIcon}
        size={size}
        style={[isSelected ? styles.selected : styles.unselected]}
      />
      {label && (
        <Text body1 style={styles.text}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unselected: {
    color: theme.colors.grey,
  },
  selected: {
    color: theme.colors.green,
  },
  text: {
    paddingLeft: 10,
    fontWeight: theme.fontWeight.semiBold,
  },
  error: {
    color: theme.colors.salmon,
  },
});

// export default React.memo(CustomCheckBox);
export default CheckBox;

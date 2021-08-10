import React, {FC} from 'react';
import {StyleSheet, TextInput, TextStyle, View, ViewProps} from 'react-native';
import theme from '../../styles/theme';
import {Icon} from '../core';

interface SearchInputProps extends ViewProps {
  placeholder?: string;
  textStyle?: TextStyle;
  onChangeText?: ((text: string) => void) | undefined;
  value?: string;
}
const SearchInput: FC<SearchInputProps> = ({
  placeholder,
  textStyle,
  onChangeText,
  value,
  ...props
}) => {
  const viewStyles = [styles.container, props.style];
  const textInputStyles = [styles.text, textStyle];
  return (
    <View style={viewStyles}>
      <Icon
        style={styles.icon}
        name="magnify"
        color={theme.colors.grey}
        size={25}
      />
      <TextInput
        autoCapitalize="none"
        placeholder={placeholder}
        style={textInputStyles}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        placeholderTextColor={theme.colors.grey}
      />
    </View>
  );
};

export default React.memo(SearchInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.lightGrey,
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  text: {
    flex: 1,
    ...theme.styles.scale.body1,
    color: theme.colors.dark,
    // backgroundColor: 'blue',
  },
  icon: {
    paddingRight: 5,
  },
});

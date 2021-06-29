import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useController from '../../hooks/userController';
import theme from '../../styles/theme';
import {Text} from '../core';
import Error from './Error';

interface AppTextInputProps extends TextInputProps {
  name: string;
  type?: 'secret' | 'plain';
  value?: string;
  defaultValue?: string;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  hideError?: boolean;
  label?: string;
  disabled?: boolean;
  control?: any;
}
const rtlSecretStyle: TextStyle = {
  textAlign: 'right',
};

const TextInputField = ({
  name,
  defaultValue = '',
  autoCapitalize = 'none',
  label,
  disabled,
  value,
  onChangeText,
  hideError = false,
  control,
  ...props
}: AppTextInputProps) => {
  const {field, formState} = useController({
    control,
    defaultValue,
    name,
  });
  const [showLabel, setShowLabel] = useState(field.value ? true : false);
  const [focused, setFocused] = useState(false);
  const [eyeIconOn, setEyeIconOn] = useState<boolean>(
    props.secureTextEntry ?? false,
  );
  // const textInputRef = React.createRef<TextInput>();

  useEffect(() => {
    if (value && value !== field.value) {
      field.onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const toggleEyeIcon = () => {
    setEyeIconOn(v => !v);
  };

  return (
    <View style={[styles.container, props.style]}>
      <Text body3 style={[styles.label]}>
        {showLabel && (label ?? props.placeholder)}
      </Text>

      <View style={styles.inputContainer}>
        <View>
          <TextInput
            ref={field.ref}
            autoCorrect={false}
            autoCapitalize={autoCapitalize}
            {...props}
            editable={!disabled}
            value={field.value}
            secureTextEntry={props.secureTextEntry && eyeIconOn}
            testID={name}
            style={[
              I18nManager.isRTL && rtlSecretStyle,
              styles.textInput,
              props.inputStyle,
              formState.errors[name]
                ? styles.textInputBorderError
                : focused
                ? styles.textInputActive
                : styles.textInputBorder,
            ]}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholderTextColor={theme.colors.grey}
            onChangeText={v => {
              if (v !== field.value) {
                field.onChange(v);
              }
              if (v) {
                setShowLabel(true);
              } else {
                setShowLabel(false);
              }
              if (onChangeText) {
                onChangeText(v);
              }
            }}
          />
          {props.secureTextEntry && (
            <Icon
              style={[styles.eyeIcon]}
              name={eyeIconOn ? 'eye' : 'eye-off'}
              size={25} // TODO change to responsive
              color={theme.colors.dark}
              onPress={toggleEyeIcon}
            />
          )}
        </View>

        {!hideError && <Error error={formState.errors[name]} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    // minHeight: 60,
    maxHeight: 60,
  },
  label: {
    // paddingTop: 10,
    color: theme.colors.grey,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.medium,
    height: 40,
    borderBottomWidth: 1,
    color: theme.colors.dark,
  },
  textInputBorder: {
    borderColor: theme.colors.grey,
  },
  textInputActive: {
    borderColor: theme.colors.green,
  },
  textInputBorderError: {
    borderColor: theme.colors.salmon,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
  },
  errorText: {
    color: theme.colors.salmon,
    paddingLeft: 5,
  },
});

export default React.memo(TextInputField);
TextInputField.whyDidYouRender = true;

import React from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';

import {Button, Screen, Text} from '../components/core';
import {FormView, TextInput} from '../components/form';
import constants from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import theme from '../styles/theme';

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
const ChangePasswordScreen = () => {
  // const navigation = useNavigation();
  const {t} = useLocale('changePasswordScreen');
  const {showToast, hideToast} = useToast();
  const {loader, request} = useApi();
  const {changePassword} = useAuth();

  const {control, handleSubmit, reset} = useForm<FormValues>({
    oldPassword: yup.string().trim().required(t('oldPassword.required')),
    newPassword: yup
      .string()
      .trim()
      .required(t('newPassword.required'))
      .matches(constants.auth.PASSWORD_PATTERN, t('newPassword.pattern')),
    confirmPassword: yup
      .string()
      .trim()
      .required(t('confirmPassword.required'))
      .test('passwords-match', t('confirmPassword.match'), function (value) {
        return this.parent.newPassword === value;
      })
      .test('password-history', t('confirmPassword.history'), function (value) {
        return this.parent.oldPassword !== value;
      }),
  });

  const onFormSuccess = async (data: FormValues) => {
    hideToast();
    try {
      await request(() => changePassword(data.oldPassword, data.newPassword));
      reset();
      showToast({
        type: 'success',
        message: t('submitSuccess'),
        options: {
          duration: 5000,
        },
      });
    } catch (err) {
      showToast({
        type: 'error',
        code: err.code,
        message: err.message,
      });
    }
  };

  return (
    <Screen style={styles.screen}>
      <FormView style={styles.formContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{t('oldPasswordtitleText')}</Text>
        </View>
        <TextInput
          secureTextEntry
          name="oldPassword"
          placeholder={t('oldPassword.placeholder')}
          returnKeyType="next"
          control={control}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{t('newPasswordtitleText')}</Text>
        </View>

        <TextInput
          secureTextEntry
          name="newPassword"
          placeholder={t('newPassword.placeholder')}
          returnKeyType="next"
          control={control}
        />
        <TextInput
          secureTextEntry
          name="confirmPassword"
          placeholder={t('confirmPassword.placeholder')}
          returnKeyType="next"
          control={control}
        />
        <Button
          title={t('submitBtnTitle')}
          onPress={handleSubmit(onFormSuccess)}
        />
      </FormView>
      {loader}
    </Screen>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  headerText: {
    ...theme.styles.scale.h6,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
});

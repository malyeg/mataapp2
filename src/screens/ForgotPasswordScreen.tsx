import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import {Button, Link, Text} from '../components/core';
import Logo from '../components/core/Logo';
import {FormView, KeyboardView} from '../components/form';
import TextInput from '../components/form/TextInput';
import constants, {screens} from '../config/constants';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import theme from '../styles/theme';
import BackgroundScreen from './BackgroundScreen';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {t} = useLocale('forgotPasswordScreen');

  const {sendPasswordResetEmail} = useAuth();
  const {showToast, hideToast} = useToast();

  const {control, handleSubmit} = useForm({
    username: yup.string().trim().email().required(t('username.required')),
  });

  const onFormError = (data: any) => {};

  const signInLinkHandler = () => {
    navigation.navigate(screens.SIGN_IN);
  };

  const onFormSuccess = async (data: {username: string}) => {
    hideToast();
    try {
      await sendPasswordResetEmail(data.username);
      showToast({
        type: 'info',
        code: 'emailSent',
        message: t('emailSentTitle'),
        options: {
          duration: 4000,
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
    <BackgroundScreen
      style={styles.screen}
      imageBackground={constants.AuthBgImage}>
      <Logo />

      <View style={styles.content}>
        <Text h4 style={styles.contentTitle}>
          {t('forgotPasswordTitle')}
        </Text>
        <Text h6>{t('forgotPasswordSubTitle')}</Text>
      </View>
      <FormView style={[styles.form]}>
        <TextInput
          style={styles.username}
          keyboardType="email-address"
          name="username"
          placeholder={t('username.placeholder')}
          returnKeyType="next"
          control={control}
        />
        {/* <View style={styles.buttonContainer}> */}
        <Button
          title={t('confirmBtnTitle')}
          onPress={handleSubmit(onFormSuccess, onFormError)}
        />
        {/* </View> */}
      </FormView>
      <KeyboardView style={styles.footer}>
        <Text body1>{t('haveAccountText')}</Text>
        <Link body1 onPress={signInLinkHandler}>
          {t('LoginLink')}
        </Link>
      </KeyboardView>
    </BackgroundScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingTop: 0,
  },
  header: {
    flex: 3,
  },
  content: {
    flex: 2,
    justifyContent: 'center',
  },
  contentTitle: {
    color: theme.colors.green,
  },
  headerError: {
    // flex: 1,
  },
  username: {
    marginBottom: 20,
  },
  form: {
    flex: 2,
  },
  confirmButton: {},
  footer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ForgotPasswordScreen;

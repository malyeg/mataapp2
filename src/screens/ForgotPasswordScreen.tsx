import {useNavigation} from '@react-navigation/core';
import {Link} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import {Button, Text} from '../components/core';
import Logo from '../components/core/Logo';
import {FormView, KeyboardView} from '../components/form';
import TextInput from '../components/form/TextInput';
import constants, {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import sharedStyles from '../styles/SharedStyles';
import theme from '../styles/theme';
import BackgroundScreen from './BackgroundScreen';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {t} = useLocale('forgotPasswordScreen');
  const {request, loader} = useApi();
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
      await request(() => sendPasswordResetEmail(data.username));
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
      <View style={styles.logoContainer}>
        <Logo style={styles.logo} />
      </View>

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
      <View style={styles.footer}>
        <Text body1>{t('haveAccountText')}</Text>
        <Link to={{screen: screens.SIGN_IN}} style={sharedStyles.link}>
          {t('LoginLink')}
        </Link>
      </View>
      {loader}
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
    flex: 1,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    // flex: 1.5,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  content: {
    flex: 1,
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
    flex: 1,
    justifyContent: 'space-around',
  },
  confirmButton: {},
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ForgotPasswordScreen;

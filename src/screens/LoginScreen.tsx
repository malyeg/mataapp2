import {useNavigation} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import {Button, Link, Text} from '../components/core';
import Logo from '../components/core/Logo';
import {KeyboardView} from '../components/form';
import TextInput from '../components/form/TextInput';
import constants from '../config/constants';
import {ICredentials} from '../contexts/AuthReducer';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import BackgroundScreen from './BackgroundScreen';

type SignInFormValues = {username: string; password: string};
const SignInScreen = () => {
  const navigation = useNavigation();
  const {t} = useLocale('signInScreen');
  const {showToast, hideToast} = useToast();

  const {signIn} = useAuth();
  const {request, loader} = useApi();

  useEffect(() => {
    const loadData = async () => {};
    loadData();
  }, []);

  const {control, handleSubmit} = useForm<SignInFormValues>({
    username: yup
      .string()
      .trim()
      .email()
      .max(100)
      .required(t('username.required')),
    password: yup.string().trim().max(100).required(t('password.required')),
  });

  const signUpLinkHandler = () => {
    navigation.navigate('SignUpScreen');
  };
  const forgotPasswordLinkHandler = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  const onFormSuccess = async (data: SignInFormValues) => {
    hideToast();
    const credentials: ICredentials = {
      username: data.username,
      password: data.password,
    };
    try {
      await request(() => signIn(credentials));
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
      <Logo style={[styles.header]} />
      <View style={[styles.form]}>
        <TextInput
          keyboardType="email-address"
          name="username"
          placeholder={t('username.placeholder')}
          returnKeyType="next"
          control={control}
        />
        <TextInput
          // style={styles.password}
          secureTextEntry
          name="password"
          placeholder={t('password.placeholder')}
          returnKeyType="next"
          control={control}
        />

        <Link
          body1
          style={styles.forgotPasswordLink}
          onPress={forgotPasswordLinkHandler}>
          {t('forgotPasswordLink')}
        </Link>

        <Button
          title={t('loginBtnTitle')}
          onPress={handleSubmit(onFormSuccess)}
        />
      </View>

      <View style={styles.footer}>
        <Text body1>{t('dontHaveAccountText')}</Text>
        <Link body1 onPress={signUpLinkHandler}>
          {t('signUpLink')}
        </Link>
        {/* <Icon.Button
        name="apple"
        backgroundColor="#3b5998"
        onPress={() =>
        Login with Facebook
      </Icon.Button> */}
      </View>
      {loader}
    </BackgroundScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 0,
    // justifyContent: 'space-around',
  },
  header: {
    flex: 2,
    // flexShrink: 0,
  },
  headerError: {
    // flex: 1,
  },
  form: {
    flex: 3,
    // flexShrink: 0,
    justifyContent: 'space-evenly',
  },
  forgotPasswordLink: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  footer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;

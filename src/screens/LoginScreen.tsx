import {useNavigation} from '@react-navigation/core';
import {Link} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import {Button, Text} from '../components/core';
import Logo from '../components/core/Logo';
import TextInput from '../components/form/TextInput';
import constants, {screens} from '../config/constants';
import {ICredentials} from '../contexts/AuthReducer';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import sharedStyles from '../styles/SharedStyles';
import BackgroundScreen from './BackgroundScreen';

type SignInFormValues = {username: string; password: string};
const SignInScreen = () => {
  const {t} = useLocale('signInScreen');
  const {showToast, hideToast} = useToast();

  const {signIn} = useAuth();
  const {request, loader} = useApi();

  useEffect(() => {
    const loadData = async () => {};
    loadData();
  }, []);

  const {control, handleSubmit, setFocus} = useForm<SignInFormValues>({
    username: yup
      .string()
      .trim()
      .email()
      .max(100)
      .required(t('username.required')),
    password: yup.string().trim().max(100).required(t('password.required')),
  });

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
        code: (err as any).code,
        message: (err as any).message,
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
      <View style={[styles.form]}>
        <TextInput
          keyboardType="email-address"
          name="username"
          placeholder={t('username.placeholder')}
          returnKeyType="next"
          control={control}
          onSubmitEditing={() => setFocus('password')}
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
          to={{screen: screens.FORGOT_PASSWORD}}
          style={[sharedStyles.link, styles.forgotPasswordLink]}>
          {t('forgotPasswordLink')}
        </Link>

        <Button
          title={t('loginBtnTitle')}
          onPress={handleSubmit(onFormSuccess)}
        />
      </View>

      <View style={styles.footer}>
        <Text body1>{t('dontHaveAccountText')}</Text>
        <Link to={{screen: screens.SIGN_UP}} style={sharedStyles.link}>
          {t('signUpLink')}
        </Link>
      </View>
      {loader}
    </BackgroundScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 50,
    // justifyContent: 'space-around',
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

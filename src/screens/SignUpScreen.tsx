import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import citiesApi, {City} from '../api/citiesApi';
import countriesApi, {Country, State} from '../api/countriesApi';
import {Profile} from '../api/profileApi';
import {Button, Link, Text} from '../components/core';
import Logo from '../components/core/Logo';
import {
  CheckBox,
  Error,
  FormView,
  KeyboardView,
  Picker,
} from '../components/form';
import TextInput from '../components/form/TextInput';
import constants, {screens} from '../config/constants';
import {ICredentials} from '../contexts/AuthReducer';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import BackgroundScreen from './BackgroundScreen';

type SignupFormValues = {
  username: string;
  password: string;
  terms: boolean;
  phone: string;
  country: string;
  state: string;
  city: string;
};
const SignUpScreen = () => {
  const navigation = useNavigation();
  const {t} = useLocale('signUpScreen');
  const {loader, request} = useApi();
  const [agreeOnTerms, setAgreeOnTerms] = useState(false);
  const {signUp} = useAuth();
  const {showToast, hideToast} = useToast();
  const [cities, setCities] = useState<City[]>([]);

  const countries = useMemo(() => countriesApi.getCountries(), []);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(c => c.id.toString() === String(158))!,
  );
  const [states, setStates] = useState<State[]>(countriesApi.getStates('158'));

  const {control, handleSubmit, formState, setValue} =
    useForm<SignupFormValues>({
      username: yup
        .string()
        .trim()
        .email()
        .max(100)
        .required(t('username.required')),
      state: yup.string().trim().required(t('state.required')),
      city: yup.string().trim().required(t('city.required')),
      phone: yup
        .string()
        .trim()
        .max(50)
        .required(t('phone.required'))
        .matches(/\d{7,}/, t('phone.pattern')),
      country: yup.string().trim().required(t('country.required')),
      password: yup
        .string()
        .trim()
        .max(200)
        .required(t('password.required'))
        .matches(constants.auth.PASSWORD_PATTERN, t('password.pattern')),
      confirmPassword: yup
        .string()
        .trim()
        .required(t('confirmPassword.required'))
        .test('passwords-match', t('confirmPassword.match'), function (value) {
          return this.parent.password === value;
        }),
      terms: yup.boolean().oneOf([true], t('terms.required')),
    });

  const signInLinkHandler = () => {
    navigation.navigate(screens.SIGN_IN);
  };

  const onCountryChange = useCallback(
    (value: string) => {
      const selectedCounty = countriesApi
        .getCountries()
        .find(country => country.id.toString() === value.toString());

      if (selectedCounty) {
        setSelectedCountry(selectedCounty);
        setValue('state', '');
        updateStates(selectedCounty?.id!);
      }
    },
    [setValue],
  );
  const onStateChange = useCallback(
    async (value: string) => {
      const newCities = await citiesApi.getByStateId(value);
      if (newCities) {
        setCities(newCities.items);
        if (newCities.items.length === 1) {
          setValue('city', newCities.items[0].id);
        }
      }
      setValue('city', '');
    },
    [setValue],
  );
  const updateStates = (countryId: string) => {
    const countryStates = countriesApi.getStates(countryId);

    if (countryStates) {
      setStates(countryStates);
    } else {
      setStates([]);
    }
  };

  const onFormSuccess = async (data: SignupFormValues) => {
    hideToast();
    const credentials: ICredentials = {
      username: data.username,
      password: data.password,
    };
    try {
      const state = states.find(s => s.id.toString() === data.state.toString());
      const city = cities.find(c => c.id === data.city);
      const profile: Omit<Profile, 'id'> = {
        email: data.username,
        country: selectedCountry,
        mobile: data.phone,
        state,
        city,
        acceptTermsFlag: data.terms ? true : false,
      };
      await request<Profile>(() => signUp(credentials, profile));
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
        <Logo style={[styles.logo]} />
      </View>
      <FormView style={[styles.form]}>
        <TextInput
          keyboardType="email-address"
          name="username"
          placeholder={t('username.placeholder')}
          returnKeyType="next"
          control={control}
        />
        <Picker
          style={styles.location}
          searchable
          placeholder={t('country.placeholder')}
          defaultValue={selectedCountry?.id}
          name="country"
          items={countries}
          onChange={onCountryChange}
          control={control}
        />
        <View style={styles.locationContainer}>
          <Picker
            style={styles.state}
            searchable
            placeholder={t('state.placeholder')}
            onChange={onStateChange}
            name="state"
            items={states!}
            control={control}
          />
          <Picker
            style={styles.city}
            searchable
            placeholder={t('city.placeholder')}
            name="city"
            items={cities}
            control={control}
          />
        </View>
        <View style={styles.rowContainer}>
          <TextInput
            style={styles.phoneCode}
            disabled
            name="phoneCode"
            value={selectedCountry?.phoneCode}
            placeholder={t('phonePrefix.placeholder')}
            returnKeyType="next"
            control={control}
          />
          <TextInput
            name="phone"
            style={styles.phone}
            placeholder={t('phone.placeholder')}
            returnKeyType="next"
            hideError
            control={control}
          />
        </View>
        {!!formState.errors.phone && <Error error={formState.errors.phone} />}
        <TextInput
          secureTextEntry
          name="password"
          placeholder={t('password.placeholder')}
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

        <CheckBox
          name="terms"
          style={styles.termsCheckbox}
          label="I agree on all terms and conditions"
          value={agreeOnTerms}
          onChange={setAgreeOnTerms}
          control={control}
        />
        <Button
          disabled={!agreeOnTerms}
          title={t('registerBtnTitle')}
          onPress={handleSubmit(onFormSuccess)}
        />
      </FormView>

      <KeyboardView style={styles.footer}>
        <Text body1>{t('haveAccountText')}</Text>
        <Link body1 onPress={signInLinkHandler}>
          {t('LoginLink')}
        </Link>
      </KeyboardView>
      {loader}
    </BackgroundScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-around',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  state: {
    flexBasis: '48%',
  },
  city: {
    flexBasis: '48%',
  },
  rowContainer: {
    flexDirection: 'row',
    // flexGrow: 0,
    // backgroundColor: 'red',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  form: {
    flex: 6,
    flexShrink: 0,
    justifyContent: 'space-between',
  },
  phoneContainer: {
    flexDirection: 'row',
  },
  countryCode: {
    marginRight: 20,
    // width: '20%',
  },

  conditionsText: {
    alignItems: 'center',
  },
  location: {
    // flexBasis: '48%',
    // backgroundColor: 'grey',
  },
  phone: {
    flexBasis: '70%',
    // backgroundColor: 'red',
  },
  phoneCode: {
    flexBasis: '25%',
    // backgroundColor: 'grey',
  },
  termsCheckbox: {
    paddingVertical: 10,
  },
  footer: {
    flex: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUpScreen;

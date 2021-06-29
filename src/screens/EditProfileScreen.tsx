import produce from 'immer';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import countriesApi, {Country, State} from '../api/countriesApi';
import profilesApi, {Profile} from '../api/profileApi';
import {Button, Loader} from '../components/core';
import PressableScreen from '../components/core/PressableScreen';
import {CheckBox, Error, FormView, Picker, TextInput} from '../components/form';
import ProfileHeader from '../components/widgets/ProfileHeader';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';

export const EDIT_PROFILE_SCREEN_NAME = 'EditProfileScreen';
type EditProfileFormValues = {
  email: string;
  firstName?: string;
  lastName?: string;
  country: string;
  phone: string;
  phoneCode: string;
  state: string;
  interests: string;
  acceptMarketingFlag: boolean;
};
const EditProfileScreen = () => {
  const {t} = useLocale('editProfileScreen');
  const {showToast, hideToast} = useToast();
  const [profile, setProfile] = useState<Profile>();
  const [states, setStates] = useState<State[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  // const [profile, setProfile] = useState<Profile>();

  const {user, updateProfile} = useAuth();
  const {loader, request} = useApi();
  // const {loader, showLoader, hideLoader, loading} = useLoader();

  const {control, formState, handleSubmit, reset, setValue} =
    useForm<EditProfileFormValues>({
      firstName: yup.string().trim().max(200),
      lastName: yup.string().trim().max(200),
      country: yup.string().trim().required(t('country.required')),
      phoneCode: yup.string().trim().required(t('phoneCode.required')),
      phone: yup
        .string()
        .trim()
        .max(50)
        .required(t('phone.required'))
        .matches(/\d{7,}/, t('phone.pattern')),
      state: yup.string().trim().required(t('state.required')),
      interests: yup.string().trim(),
      acceptMarketingFlag: yup.boolean(),
    });

  useEffect(() => {
    // showLoader();
    loadData().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!selectedCountry && profile?.country?.id !== selectedCountry.id) {
      setValue('state', '');
    }
  }, [selectedCountry, setValue, profile]);

  const loadData = async () => {
    try {
      const freshProfile = await request<Profile>(() =>
        profilesApi.getById(user.id, {cache: {enabled: true}}),
      );

      if (freshProfile) {
        setProfile(freshProfile);
        updateStates(freshProfile.country?.id!);
      } else {
        console.log('profile not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const countries = useMemo(() => countriesApi.getCountries(), []);

  const onCountryChange = useCallback((value: string) => {
    const selectedCounty = countriesApi
      .getCountries()
      .find(country => country.id.toString() === value.toString());

    if (selectedCounty) {
      setSelectedCountry(selectedCounty);
      updateStates(selectedCounty?.id!);
    }
  }, []);

  const updateStates = (countryId: string) => {
    const countryStates = countriesApi.getStates(countryId);

    if (countryStates) {
      setStates(countryStates);
    } else {
      setStates([]);
    }
  };

  const onFormSuccess = async (data: EditProfileFormValues) => {
    //
    hideToast();
    try {
      const dirtyFields = formState.dirtyFields;
      const country = countriesApi
        .getCountries()
        .find(v => v.id.toString() === data.country);
      const state = dirtyFields.state
        ? countriesApi
            .getStates(selectedCountry?.id.toString() ?? profile?.country?.id!)
            .find(s => s.id.toString() === data.state.toString())
        : profile?.state!;

      const newProfile = produce(profile, draft => {
        if (draft) {
          draft.id = user.id;

          draft.firstName = data.firstName ?? '';
          draft.lastName = data.lastName ?? '';
          // !!dirtyFields.interests &&
          //   (draft.interests = data.interests.split(','));
          draft.country = country;
          draft.state = state;
          draft.acceptMarketingFlag = data.acceptMarketingFlag ?? true;
        }
      });

      const updatedProfile = await request<Profile>(() =>
        updateProfile(newProfile!),
      );
      setProfile(updatedProfile);
      reset(undefined, {keepValues: true});
      showToast({
        type: 'success',
        message: t('changeSuccess'),
        options: {
          duration: 5000,
        },
      });
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        code: err.code,
        message: err.message,
      });
    }
  };
  const onFormError = (data: any) => {};

  // return loader;
  return profile ? (
    <PressableScreen style={styles.screen}>
      <ProfileHeader />
      <FormView style={[styles.form]}>
        <View style={styles.nameContainer}>
          <TextInput
            style={styles.rowItem}
            name="firstName"
            placeholder={t('firstName.placeholder')}
            returnKeyType="next"
            defaultValue={profile?.firstName}
            control={control}
          />
          <TextInput
            style={styles.rowItem}
            name="lastName"
            placeholder={t('lastName.placeholder')}
            returnKeyType="next"
            defaultValue={profile?.lastName}
            control={control}
          />
        </View>
        <TextInput
          disabled
          defaultValue={user.email}
          name="email"
          placeholder={t('email.placeholder')}
          returnKeyType="next"
          control={control}
        />
        <View style={styles.rowContainer}>
          <Picker
            style={styles.location}
            searchable
            placeholder={t('country.placeholder')}
            name="country"
            items={countries}
            defaultValue={profile?.country?.id.toString()}
            onChange={onCountryChange}
            control={control}
          />
          <Picker
            style={styles.location}
            searchable
            // disabled={!!states && states.length > 0}
            placeholder={t('state.placeholder')}
            defaultValue={profile?.state?.id.toString()}
            name="state"
            items={states}
            control={control}
          />
        </View>
        <View style={styles.rowContainer}>
          <TextInput
            style={styles.phoneCode}
            disabled
            hideError
            name="phoneCode"
            defaultValue={profile?.country?.phoneCode}
            value={selectedCountry?.phoneCode}
            keyboardType="phone-pad"
            placeholder={t('phonePrefix.placeholder')}
            returnKeyType="next"
            control={control}
          />
          <TextInput
            name="phone"
            hideError
            defaultValue={profile?.mobile}
            style={styles.phone}
            keyboardType="phone-pad"
            placeholder={t('phone.placeholder')}
            returnKeyType="next"
            control={control}
          />
        </View>
        {formState.errors.phone && <Error error={formState.errors.phone} />}
        {/* <TextInput
            name="interests"
            // defaultValue={profile?.interests}
            style={styles.rowItem}
            placeholder={t('interests.placeholder')}
            returnKeyType="next"
            control={control}
          /> */}
        <CheckBox
          name="acceptMarketingFlag"
          label={t('marketingFlag.label')}
          defaultValue={profile?.acceptMarketingFlag}
          control={control}
        />
        <Button
          disabled={!formState.isDirty}
          title={t('submitBtnTitle')}
          onPress={handleSubmit(onFormSuccess, onFormError)}
        />
      </FormView>
      {loader}
    </PressableScreen>
  ) : (
    <Loader />
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: 'grey',
  },
  header: {
    // flex: 1,
    // backgroundColor: 'grey',
  },
  form: {
    flex: 4,
    justifyContent: 'space-evenly',
    // backgroundColor: 'grey',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowItem: {
    flexBasis: '48%',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    // flexGrow: 1,
    // height: 100,
    // backgroundColor: 'red',
    justifyContent: 'space-between',
  },
  location: {
    flexBasis: '48%',
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
});

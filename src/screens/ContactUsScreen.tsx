import React from 'react';
import {StyleSheet} from 'react-native';
import * as yup from 'yup';
import emailsApi, {Email} from '../api/emailsApi';
import {Button, Screen} from '../components/core';
import {TextInput} from '../components/form';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import theme from '../styles/theme';

type FormValues = {
  subject: string;
  body: string;
};

const ContactUsScreen = () => {
  const {t} = useLocale(screens.CONTACT_US);
  const {loader, request} = useApi();
  const {profile, getName} = useAuth();
  const {showToast, hideToast} = useToast();
  const {control, setFocus, handleSubmit, reset} = useForm<FormValues>({
    subject: yup.string().trim().max(50).required(t('subject.required')),
    body: yup.string().trim().required(t('body.required')),
  });

  const onFormSuccess = async (data: FormValues) => {
    //   emailsApi.add(data);
    try {
      hideToast();
      const email: Omit<Email, 'id'> = {
        subject: data.subject,
        text: data.body,
        userId: profile?.id!,
        user: {
          id: profile?.id!,
          name: getName(),
          email: profile?.email,
        },
      };
      request<Email>(() => emailsApi.add(email));
      showToast({
        type: 'success',
        message: t('submitSuccess'),
        options: {
          duration: 5000,
        },
      });
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Screen style={styles.screen}>
      <TextInput
        name="subject"
        placeholder={t('subject.placeholder')}
        returnKeyType="next"
        control={control}
        onSubmitEditing={() => setFocus('body')}
      />

      <TextInput
        name="body"
        multiline={true}
        numberOfLines={10}
        placeholder={t('body.placeholder')}
        returnKeyType="next"
        control={control}
        inputStyle={styles.messageText}
      />

      <Button
        title={t('submitBtnTitle')}
        onPress={handleSubmit(onFormSuccess)}
      />
      {loader}
    </Screen>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  messageText: {
    height: 300,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    textAlignVertical: 'top',
    marginTop: 10,
  },
});

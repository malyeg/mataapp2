import React from 'react';
// import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {Screen} from '../components/core';
import Chat from '../components/widgets/Chat';

const ThemeScreen = () => {
  return (
    <Screen style={styles.screen}>
      <Chat dealId="nIv4S72EqQS3T9iIkULN" />
    </Screen>
  );
};

export default ThemeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

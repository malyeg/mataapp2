import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Button, Image, Screen, Text} from '../components/core';
import {payment, screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import theme from '../styles/theme';

const SupportUsScreen = () => {
  const {t} = useLocale(screens.SUPPORT_US);
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/support-us.png')}
          style={styles.image}
        />
        <Text style={styles.content}>{t('content')}</Text>
        <Button
          title="Support"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => Linking.openURL(payment.SUPPORT_US_URL)}
        />
      </View>
    </Screen>
  );
};

export default SupportUsScreen;

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '50%',
  },
  container: {
    flex: 0.75,
    justifyContent: 'space-evenly',
    // alignItems: 'center',
  },
  content: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.green,
    // borderColor: theme.colors.grey,
    // borderWidth: 2,
  },
  buttonText: {
    color: theme.colors.white,
  },
});

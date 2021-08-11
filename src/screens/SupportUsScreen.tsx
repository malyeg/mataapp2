import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Button, Image} from '../components/core';
import {payment} from '../config/constants';

const SupportUsScreen = () => {
  return (
    <View>
      {/* <Image uri="" /> */}
      <Button
        title="Buy me a coffee"
        onPress={() => Linking.openURL(payment.SUPPORT_US_URL)}
      />
    </View>
  );
};

export default SupportUsScreen;

const styles = StyleSheet.create({});

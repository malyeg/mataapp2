import {useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const DealDetailsScreen = () => {
  const route = useRoute();
  useEffect(() => {
    console.log('routes', route.params);
  }, [route.params]);
  return (
    <View>
      <Text>DealDetailsScreen</Text>
    </View>
  );
};

export default DealDetailsScreen;

const styles = StyleSheet.create({});

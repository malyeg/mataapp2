import React, {useCallback, useMemo, useRef, useState} from 'react';
// import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import * as yup from 'yup';
import {Button, Screen, Text} from '../components/core';
import useForm from '../hooks/useForm';

const ThemeScreen = () => {
  const [state, setState] = useState<string>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const {control, handleSubmit} = useForm({
    location: yup.object(),
  });

  const updateState = async () => {
    // const cacheTest = new CacheTest();
    // const item = cacheTest.getItem();
    // setState(item);
  };
  return (
    <Screen>
      <Text>{JSON.stringify(state)}</Text>
      <Button title="get from cache" onPress={updateState} />
      {/* <LocationSelector control={control} /> */}
      {/* <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <View>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet> */}
    </Screen>
  );
};

export default ThemeScreen;

const styles = StyleSheet.create({});

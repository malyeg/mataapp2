import React from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  Observable,
  tap,
} from 'rxjs';
import {useEventCallback} from 'rxjs-hooks';
import {Text} from '../core';

interface ItemsSearchProps {
  style?: StyleProp<ViewStyle>;
}

const filterArrays = (text: string) => {
  return text.split(',');
};
const ItemsSearch = ({style}: ItemsSearchProps) => {
  const [clickCallback, value] = useEventCallback(
    (event$: Observable<NativeSyntheticEvent<any>>) =>
      event$.pipe(
        map(e => e.nativeEvent.text),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(text => filterArrays(text)),
        tap(v => console.log('tap', v)),
      ),
    'nothing',
  );

  return (
    <View style={style}>
      <TextInput placeholder="Search" onChange={clickCallback} />
      <Text>{value}</Text>
    </View>
  );
};

export default ItemsSearch;

const styles = StyleSheet.create({});

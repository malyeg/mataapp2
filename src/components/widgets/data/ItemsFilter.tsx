import React, {useCallback, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import theme from '../../../styles/theme';
import {Text} from '../../core';
import Icon from '../../core/Icon';

interface ItemsFilterProps {
  onChange?: () => void;
  style?: StyleProp<ViewStyle>;
}
const ItemsFilter = ({onChange, style}: ItemsFilterProps) => {
  const [state, setState] = useState<boolean>(false);

  const onChangeState = useCallback(() => {
    setState(s => !s);
  }, []);
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Filter</Text>
      <Icon
        name={state === true ? 'filter-plus-outline' : 'filter-outline'}
        size={30}
        color={theme.colors.dark}
        onPress={onChangeState}
      />
    </View>
  );
};

export default React.memo(ItemsFilter);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    // marginRight: 10,
  },
});

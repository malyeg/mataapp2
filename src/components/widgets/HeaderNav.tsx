import {useNavigation} from '@react-navigation/core';
import {StackHeaderLeftButtonProps} from '@react-navigation/stack';
import React, {FC, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../styles/theme';
import PressableObacity from '../core/PressableObacity';

const HeaderNav: FC<StackHeaderLeftButtonProps> = (
  {
    // navigation,
    // route,
  },
) => {
  const navigation = useNavigation();
  const onPressHandler = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeTabs');
    }
  }, [navigation]);
  return (
    <PressableObacity onPress={onPressHandler} style={styles.container}>
      <Icon name="chevron-left" color={theme.colors.grey} size={35} />
    </PressableObacity>
  );
};

export default React.memo(HeaderNav);

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

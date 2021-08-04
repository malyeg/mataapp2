import {useNavigation} from '@react-navigation/core';
import {
  DrawerHeaderProps,
  DrawerNavigationHelpers,
} from '@react-navigation/drawer/lib/typescript/src/types';
import {NavigationHelpers} from '@react-navigation/native';
import {StackHeaderLeftButtonProps} from '@react-navigation/stack';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {FC, useCallback} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {screens} from '../../config/constants';
import theme from '../../styles/theme';
import PressableOpacity from '../core/PressableOpacity';

interface HeaderNavProps {
  style: ViewStyle;
}
const HeaderNav = ({style}: HeaderNavProps) => {
  const navigation = useNavigation<
    StackNavigationHelpers | DrawerNavigationHelpers
  >();
  const onPressHandler = useCallback(() => {
    if (navigation.canGoBack()) {
      console.log('canGoBack', navigation.getState().history);

      navigation.goBack();
    } else {
      console.log('cannot GoBack');
      navigation.navigate(screens.HOME_TABS, {
        screen: screens.HOME,
      });
    }
  }, [navigation]);
  return (
    <PressableOpacity
      onPress={onPressHandler}
      style={[styles.container, style]}>
      <Icon name="chevron-left" color={theme.colors.grey} size={35} />
    </PressableOpacity>
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

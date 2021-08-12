import {useNavigation} from '@react-navigation/core';
import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import React, {FC} from 'react';
import {StyleSheet, ViewProps} from 'react-native';
import {screens} from '../../config/constants';
import theme from '../../styles/theme';
import {Icon} from '../core';
import PressableOpacity from '../core/PressableOpacity';

interface ProfileIconProps extends ViewProps {
  size?: number;
}
const ProfileIcon: FC<ProfileIconProps> = ({style, size = 25}) => {
  const navigation = useNavigation<DrawerNavigationHelpers>();
  return (
    <PressableOpacity
      hitSlop={10}
      style={[styles.container, style]}
      onPress={() => navigation.navigate(screens.PROFILE)}>
      <Icon
        name="account-outline"
        size={size}
        style={styles.profileIcon}
        color={theme.colors.dark}
      />
    </PressableOpacity>
  );
};

export default React.memo(ProfileIcon);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  profileIcon: {},
  separator: {
    height: 10,
  },
});

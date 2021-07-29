import {useNavigation} from '@react-navigation/core';
import React, {FC} from 'react';
import {StyleSheet, ViewProps} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {screens} from '../../config/constants';
import theme from '../../styles/theme';
import PressableOpacity from '../core/PressableOpacity';

interface ProfileIconProps extends ViewProps {
  size?: number;
}
const ProfileIcon: FC<ProfileIconProps> = ({style, size = 25}) => {
  const navigation = useNavigation();
  return (
    <PressableOpacity
      hitSlop={10}
      style={[styles.container, style]}
      onPress={() => navigation.navigate(screens.PROFILE_STACK)}>
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

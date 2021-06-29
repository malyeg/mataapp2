import {useNavigation} from '@react-navigation/core';
import React, {FC} from 'react';
import {StyleSheet, ViewProps} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../styles/theme';
import PressableObacity from '../core/PressableObacity';

interface ProfileIconProps extends ViewProps {
  size?: number;
}
const ProfileIcon: FC<ProfileIconProps> = ({style, size = 25}) => {
  const navigation = useNavigation();
  return (
    <PressableObacity
      hitSlop={10}
      style={[styles.container, style]}
      onPress={() => navigation.navigate('ProfileScreen')}>
      <Icon
        name="account-edit-outline"
        size={size}
        style={styles.profileIcon}
        color={theme.colors.dark}
      />
    </PressableObacity>
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

import React from 'react';
import {StyleSheet, Text, TextStyle, View, ViewProps} from 'react-native';
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme';
import {Icon} from '../core';

interface ProfileHeaderProps extends ViewProps {
  profileIconSize?: number;
  userNameStyle?: TextStyle;
}
const ProfileHeader = ({
  style,
  userNameStyle,
  profileIconSize = 60,
}: ProfileHeaderProps) => {
  const {user, profile} = useAuth();
  // useEffect(() => {}, [profile]);
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            width: profileIconSize,
            height: profileIconSize,
            borderRadius: profileIconSize / 2,
          },
        ]}>
        <Icon
          style={styles.profileIcon}
          name="account-outline"
          // color="#F2A39C"
          color={theme.colors.grey}
          size={profileIconSize * 0.7}
        />
      </View>
      <Text style={[styles.userName, userNameStyle]} numberOfLines={1}>
        {profile?.firstName
          ? `${profile.firstName} ${profile.lastName}`
          : user.username}
      </Text>
    </View>
  );
};

export default React.memo(ProfileHeader);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: 200,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGrey,
    // height: 100,
    // width: 100,
    // borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileIcon: {
    // borderWidth: 2,
  },
  userName: {
    ...theme.styles.scale.h5,
  },
});

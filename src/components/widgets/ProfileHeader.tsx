import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme';

const ProfileHeader = () => {
  const {user, profile} = useAuth();
  // useEffect(() => {}, [profile]);
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon
          style={styles.profileIcon}
          name="account-outline"
          // color="#F2A39C"
          color={theme.colors.grey}
          size={60}
        />
      </View>
      <Text style={styles.userName} numberOfLines={1}>
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
    height: 100,
    width: 100,
    borderRadius: 50,
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

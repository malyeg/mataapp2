import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme';
import {Icon, Text} from '../core';
import {IconProps} from '../core/Icon';

interface ProfileHeaderProps extends ViewProps {
  userNameStyle?: StyleProp<TextStyle>;
  icon?: Partial<IconProps>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
const ProfileHeader = ({
  style,
  userNameStyle,
  iconContainerStyle,
  icon,
  onPress,
}: ProfileHeaderProps) => {
  const profileIconSize = icon?.size ?? 110;
  const {user, profile} = useAuth();
  // useEffect(() => {}, [profile]);
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <View
        style={[
          styles.iconContainer,
          iconContainerStyle,
          {
            width: profileIconSize,
            height: profileIconSize,
            borderRadius: profileIconSize / 2,
          },
        ]}>
        <Icon
          style={[styles.profileIcon, icon?.style]}
          name={icon?.name ?? 'profile'}
          color={icon?.color ?? theme.colors.white}
          size={icon?.size ?? profileIconSize * 0.5}
          type={icon?.type ?? 'svg'}
        />
      </View>
      <Text
        style={[styles.userName, userNameStyle]}
        numberOfLines={1}
        ellipsizeMode="tail">
        {profile?.firstName
          ? `${profile.firstName} ${profile.lastName}`
          : user.username}
      </Text>
    </Pressable>
  );
};

export default React.memo(ProfileHeader);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: 200,
  },
  header: {
    marginBottom: 40,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.salmon,
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

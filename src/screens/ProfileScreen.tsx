import {useNavigation} from '@react-navigation/core';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {FC, useEffect, useState} from 'react';
import {Pressable, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {Button, Icon, Modal, Screen, Text} from '../components/core';
import ProfileHeader from '../components/widgets/ProfileHeader';
import constants, {screens} from '../config/constants';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import useSocial from '../hooks/useSocial';
// import useSocial from '../hooks/useSocial';
import theme from '../styles/theme';

const ProfileScreen = () => {
  const {signOut} = useAuth();
  const {t} = useLocale('profileScreen');
  const navigation = useNavigation<StackNavigationHelpers>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {onShare} = useSocial();

  useEffect(() => {
    // TODO get profile data from back
  }, []);
  const closeModal = () => {
    setLogoutModalVisible(false);
  };

  const onInviteUser = () => {
    onShare(constants.SHARE_DOMAIN);
  };
  return (
    <Screen style={styles.container} scrollable={false}>
      <ProfileHeader
        style={styles.profileHeader}
        userNameStyle={styles.profileNameText}
        icon={{color: theme.colors.grey}}
        iconContainerStyle={styles.iconContainer}
      />
      <ProfileItem
        title={t('editProfileLink')}
        onPress={() => navigation.navigate(screens.EDIT_PROFILE)}
      />
      <ProfileItem
        title={t('changePasswordLink')}
        onPress={() => navigation.navigate(screens.CHANGE_PASSWORD)}
      />
      <ProfileItem
        title={t('myItemsLink')}
        onPress={() => navigation.navigate(screens.MY_ITEMS)}
      />

      <ProfileItem
        title={t('inviteUserTitle')}
        onPress={onInviteUser}
        // chevron={false}
      />
      <ProfileItem
        title={t('wishListTitle')}
        onPress={() => navigation.navigate(screens.WISH_LIST)}
        // chevron={false}
      />

      <ProfileItem
        style={styles.logout}
        titleStyle={styles.logoutText}
        title={t('logout.logoutLink')}
        onPress={() => setLogoutModalVisible(true)}
        chevron={false}
      />

      {/* <Button title="Share" onPress={() => onShare()} /> */}

      <Modal
        isVisible={logoutModalVisible}
        position="bottom"
        onClose={closeModal}
        // containerStyle={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.confirmLogoutTitle}>
            {t('logout.confirmLogoutTitle')}
          </Text>
          <Text style={styles.confirmLogoutText}>
            {t('logout.confirmLogoutText')}
          </Text>
          <View style={styles.modalButtonContainer}>
            <Button
              themeType="white"
              title={t('logout.cancelBtnTitle')}
              style={[styles.modalButton]}
              onPress={closeModal}
            />
            <Button
              title={t('logout.confirmLogoutBtnTitle')}
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => signOut()}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

type ProfileItemProps = {
  title: string;
  onPress: () => void;
  chevron?: boolean;
  titleStyle?: TextStyle;
  style?: ViewStyle;
};
const ProfileItem: FC<ProfileItemProps> = ({
  title,
  chevron = true,
  onPress,
  titleStyle,
  style,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.itemContainer, style]}>
      <Text style={[styles.itemText, titleStyle]}>{title}</Text>
      {chevron && (
        <Icon
          name="chevron-right"
          color={theme.colors.grey}
          size={35}
          style={styles.chevronIcon}
        />
      )}
    </Pressable>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  profileHeader: {
    marginBottom: 40,
  },
  profileNameText: {
    ...theme.styles.scale.h6,
    // color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
    // marginHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: theme.colors.lightGrey,
  },
  profileIcon: {
    color: theme.colors.dark,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderBottomColor: theme.colors.lightGrey,
    borderBottomWidth: 2,
  },

  userName: {
    ...theme.styles.scale.h5,
  },
  itemText: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
  },
  chevronIcon: {
    marginRight: -10,
  },
  logout: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: theme.colors.salmon,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 40,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.grey,
    borderWidth: 1,
  },
  confirmLogoutTitle: {
    ...theme.styles.scale.h5,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
  },
  confirmLogoutText: {
    ...theme.styles.scale.h6,
  },
  modal: {
    // flex: 1,
    // height: 200,
  },
  modalContainer: {
    // flex: 1,
    // height: 200,
  },
});

import {useNavigation} from '@react-navigation/core';
import React, {FC, useEffect, useState} from 'react';
import {Pressable, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, Modal, Screen, Text} from '../components/core';
import ProfileHeader from '../components/widgets/ProfileHeader';
import {screens} from '../config/constants';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
// import useSocial from '../hooks/useSocial';
import theme from '../styles/theme';
import {EDIT_PROFILE_SCREEN_NAME} from './EditProfileScreen';
import {MY_ITEMS_SCREEN} from './MyItemsScreen';

const ProfileScreen = () => {
  const {signOut} = useAuth();
  const {t} = useLocale('profileScreen');
  const navigation = useNavigation();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  // const {onShare} = useSocial();

  useEffect(() => {
    // TODO get profile data from back
  }, []);
  const closeModal = () => {
    setLogoutModalVisible(false);
  };
  return (
    <Screen style={styles.container} scrollable={false}>
      <ProfileHeader />
      <ProfileItem
        title={t('editProfileLink')}
        onPress={() => navigation.navigate(EDIT_PROFILE_SCREEN_NAME)}
      />
      <ProfileItem
        title={t('changePasswordLink')}
        onPress={() => navigation.navigate('ChangePasswordScreen')}
      />
      <ProfileItem
        title={t('myItemsLink')}
        onPress={() => navigation.navigate(MY_ITEMS_SCREEN)}
      />
      {/* <ProfileItem
        title={t('dealsLink')}
        onPress={() => navigation.navigate(screens.DEALS_TABS)}
      /> */}

      <ProfileItem
        style={styles.logout}
        titleStyle={styles.logoutText}
        title={t('logout.logoutLink')}
        onPress={() => setLogoutModalVisible(true)}
        chevron={false}
      />

      {/* <Button title="Share" onPress={() => onShare()} /> */}

      <Modal isVisible={logoutModalVisible} onClose={closeModal}>
        <Text style={styles.confirmLogoutTitle}>
          {t('logout.confirmLogoutTitle')}
        </Text>
        <Text style={styles.confirmLogoutText}>
          {t('logout.confirmLogoutText')}
        </Text>
        <View style={styles.modalButtonContainer}>
          <Button
            title={t('logout.cancelBtnTitle')}
            style={[styles.modalButton]}
            onPress={closeModal}
          />
          <Button
            title={t('logout.confirmLogoutBtnTitle')}
            style={[styles.modalButton, styles.confirmButton]}
            textStyle={styles.confirmText}
            onPress={() => signOut()}
          />
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderBottomColor: theme.colors.lightGrey,
    borderBottomWidth: 2,
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
  itemText: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
  },
  chevronIcon: {
    // backgroundColor: 'grey',
    marginRight: -10,
  },
  logout: {
    // marginTop: 20,
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
  confirmText: {
    color: theme.colors.dark,
  },
  confirmLogoutTitle: {
    ...theme.styles.scale.h5,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
  },
  confirmLogoutText: {
    ...theme.styles.scale.h6,
  },
});

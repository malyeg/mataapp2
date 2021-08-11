import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {useLinkTo} from '@react-navigation/native';
import React from 'react';
import {Linking, StyleSheet} from 'react-native';
import ProfileHeader from '../components/widgets/ProfileHeader';
import {screens, stacks} from '../config/constants';
import useLocale from '../hooks/useLocale';
import theme from '../styles/theme';
import DrawerItem from './DrawerItem';

const DrawerContent = ({navigation, ...props}: DrawerContentComponentProps) => {
  const {t} = useLocale('common');
  const linkTo = useLinkTo();

  return (
    <DrawerContentScrollView {...props}>
      <ProfileHeader style={styles.header} userNameStyle={styles.profileName} />

      <DrawerItem
        label={t('drawer.myItemsLabel')}
        icon="view-list-outline"
        onPress={() => linkTo('/items/myItems')}
      />
      <DrawerItem
        label={t('drawer.dealsLabel')}
        icon="handshake"
        iconStyle={styles.dealsIcon}
        onPress={() => navigation.navigate(stacks.DEALS_STACK)}
      />

      <DrawerItem
        label={t('drawer.profileLabel')}
        icon="account-outline"
        onPress={() => navigation.navigate(stacks.PROFILE_STACK)}
      />
      <DrawerItem
        label={t('drawer.settingsLabel')}
        icon="cog-outline"
        onPress={() => navigation.navigate(screens.SETTINGS)}
      />
      <DrawerItem
        label={t('drawer.notificationsLabel')}
        icon="bell-outline"
        onPress={() => navigation.navigate(screens.NOTIFICATIONS)}
        badge={10}
      />
      <DrawerItem
        label={t('drawer.faqLabel')}
        icon="help"
        onPress={() => navigation.navigate(screens.FAQ)}
      />
      <DrawerItem
        label={t('drawer.supportUsLabel')}
        icon="gift-outline"
        onPress={() => navigation.navigate(screens.SUPPORT_US)}
      />
      <DrawerItem
        label={t('drawer.contactUsLabel')}
        icon="phone"
        onPress={() => Linking.openURL('http://www.mataup.com/contact-us')}
        style={styles.lastItem}
      />
    </DrawerContentScrollView>
  );
};

export default React.memo(DrawerContent);

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  profileName: {
    ...theme.styles.scale.h6,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  dealsIcon: {
    transform: [{rotate: '40deg'}],
  },
  separator: {borderTopWidth: 2, borderColor: theme.colors.lightGrey},
  section: {
    paddingVertical: 5,
  },
});

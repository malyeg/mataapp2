import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import DrawerItem from './DrawerItem';
import ProfileHeader from '../components/widgets/ProfileHeader';
import {screens} from '../config/constants';
import theme from '../styles/theme';
import useLocale from '../hooks/useLocale';
import DrawerSection from './DrawerSection';

const DrawerContent = ({
  navigation,
  ...props
}: DrawerContentComponentProps<DrawerContentOptions>) => {
  const {t} = useLocale('common');

  return (
    <DrawerContentScrollView {...props}>
      <ProfileHeader style={styles.header} userNameStyle={styles.profileName} />

      <DrawerItem
        label={t('drawer.nearByItemsLabel')}
        icon="table-search"
        onPress={() => navigation.navigate(screens.ITEMS)}
      />
      <DrawerItem
        label={t('drawer.dealsLabel')}
        icon="handshake"
        iconStyle={styles.dealsIcon}
        onPress={() => navigation.navigate(screens.DEALS_TABS)}
      />

      <DrawerItem
        label={t('drawer.profileLabel')}
        icon="account-outline"
        onPress={() => navigation.navigate(screens.PROFILE_STACK)}
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
        style={styles.lastItem}
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

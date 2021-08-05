import React from 'react';
import {StyleSheet, View} from 'react-native';
import theme from '../../styles/theme';
import {Text} from '../core';
import HeaderNav from './HeaderNav';
import ShareIcon from './ShareIcon';

interface HeaderProps {
  title?: string;
  navigation: any;
  route: any;
  shareMessage?: string;
  children?: any;
}
const Header = ({
  title,
  route,
  shareMessage,
  children,
  ...props
}: HeaderProps) => {
  // const route = useRoute();
  return (
    <View style={styles.container}>
      <HeaderNav style={styles.nav} route={route} {...props} />
      <Text style={styles.title} h5 numberOfLines={1}>
        {title ?? (route?.params as {title: string})?.title ?? route.name}
      </Text>
      <View style={styles.rightContainer}>
        {shareMessage && <ShareIcon message={shareMessage} />}
        {children}
      </View>
    </View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // height: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  title: {
    // flex: 1,
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
  },
  nav: {
    position: 'absolute',
    left: 0,
  },
  rightContainer: {
    position: 'absolute',
    right: 0,
  },
});

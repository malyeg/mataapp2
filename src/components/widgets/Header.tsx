import {useRoute} from '@react-navigation/core';
import {DrawerHeaderProps} from '@react-navigation/drawer/lib/typescript/src/types';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import theme from '../../styles/theme';
import {Text} from '../core';
import HeaderNav from './HeaderNav';

interface HeaderProps {
  title?: string;
  navigation: any;
}
const Header = ({title, ...props}: HeaderProps) => {
  const route = useRoute();
  return (
    <View style={styles.container}>
      <HeaderNav style={styles.nav} {...props} />
      <Text style={styles.title} h5 numberOfLines={1}>
        {title ?? (route?.params as {title: string})?.title ?? route.name}
      </Text>
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
});

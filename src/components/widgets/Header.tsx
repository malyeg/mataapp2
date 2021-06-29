import {useRoute} from '@react-navigation/core';
import {StackHeaderTitleProps} from '@react-navigation/stack';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import theme from '../../styles/theme';
import {Text} from '../core';

interface HeaderProps extends StackHeaderTitleProps {
  title?: string;
}
const Header: FC<HeaderProps> = ({title}) => {
  const route = useRoute();
  return (
    <View style={styles.container}>
      <Text style={styles.title} h5>
        {title ?? (route?.params as {title: string})?.title ?? route.name}
      </Text>
    </View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  container: {},
  title: {
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
  },
});

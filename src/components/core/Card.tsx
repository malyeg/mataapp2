import React from 'react';
import {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import sharedStyles from '../../styles/SharedStyles';
import theme from '../../styles/theme';
import Icon from './Icon';

interface CardProps {
  iconName?: string;
  children: ReactNode;
}
const Card = ({children, iconName}: CardProps) => {
  return (
    <View style={sharedStyles.card}>
      {!!iconName && <Icon name={iconName} color={theme.colors.salmon} />}
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({});

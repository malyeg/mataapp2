import React, {ReactNode} from 'react';
import {Pressable, StyleProp, StyleSheet, TextStyle} from 'react-native';
import theme from '../../styles/theme';
import Icon from './Icon';

interface CardProps {
  children: ReactNode;
  icon?: {
    name: string;
    style?: StyleProp<TextStyle>;
    size?: number;
  };
  onPress?: () => void;
}
const Card = ({children, icon, onPress}: CardProps) => {
  return (
    <Pressable
      style={[
        styles.container,
        icon ? styles.hasIcon : {},
        onPress ? styles.hasChevron : {},
      ]}
      onPress={onPress}>
      {!!icon && (
        <Icon
          name={icon.name}
          color={theme.colors.salmon}
          style={styles.icon}
          size={icon.size ?? 25}
        />
      )}
      {children}
      {!!onPress && (
        <Icon
          name="chevron-right"
          color={theme.colors.salmon}
          style={styles.chevron}
          size={25}
        />
      )}
    </Pressable>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 10,
    // paddingLeft: 50,
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  chevron: {
    position: 'absolute',
    right: 5,
  },
  hasIcon: {
    paddingLeft: 50,
  },
  hasChevron: {
    paddingRight: 20,
  },
});

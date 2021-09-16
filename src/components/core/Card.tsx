import React, {ReactNode} from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native';
import theme from '../../styles/theme';
import Icon, {IconProps} from './Icon';

interface CardProps extends ViewProps {
  icon?: IconProps;
  onPress?: () => void;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  hideChevron?: boolean;
}
const Card = ({style, hideChevron, children, icon, onPress}: CardProps) => {
  return (
    <Pressable
      style={[styles.container, style, icon ? styles.hasIcon : {}]}
      onPress={onPress}>
      {!!icon && (
        <Icon
          name={icon.name}
          color={theme.colors.salmon}
          style={styles.icon}
          type={icon.type}
          size={icon.size ?? 25}
        />
      )}
      {children}
      {!!onPress && !hideChevron && (
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
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.grey,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.6,
        shadowRadius: 1,
      },
      android: {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.5,
        elevation: 3,
      },
    }),
  },
  icon: {
    // position: 'absolute',
    // left: 10,
    marginRight: 5,
  },
  chevron: {
    marginLeft: 'auto',
  },
  hasIcon: {
    // marginRight: 'auto',
  },
  hasChevron: {
    // paddingRight: 20,
    // marginRight: 'auto',
  },
  content: {
    flex: 1,
  },
});

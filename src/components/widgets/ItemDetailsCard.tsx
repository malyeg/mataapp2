import React, {ReactNode} from 'react';
import {Platform, StyleProp, StyleSheet, TextStyle, View} from 'react-native';
import theme from '../../styles/theme';
import {Icon, Text} from '../core';
import {IconType} from '../core/Icon';

interface CardProps {
  title: string;
  content: string;
  icon?: string;
  iconType?: IconType;
  contentStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
}
const ItemDetailsCard = ({
  title,
  content,
  icon,
  iconType,
  contentStyle,
  iconStyle,
  children,
}: CardProps) => {
  return (
    <View style={styles.container}>
      {!!icon && (
        <Icon
          name={icon}
          type={iconType}
          color={theme.colors.salmon}
          style={[styles.icon, iconStyle]}
        />
      )}
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text
            style={[styles.content, contentStyle]}
            // numberOfLines={2}
            // adjustsFontSizeToFit
          >
            {content}
          </Text>
        </View>
        {!!children && <View style={styles.childrenContainer}>{children}</View>}
      </View>
    </View>
  );
};

export default ItemDetailsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 5,
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
        shadowColor: theme.colors.grey,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.3,
        elevation: 3,
      },
    }),
  },
  icon: {
    position: 'absolute',
    left: 7,
  },
  header: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 25,
  },
  title: {
    color: theme.colors.salmon,
    width: 85,
    // fontWeight: '700',
    // marginLeft: 5,
  },
  content: {
    textTransform: 'capitalize',
    width: '70%',
    textAlign: 'justify',
  },
  childrenContainer: {
    marginLeft: 25,
  },
});

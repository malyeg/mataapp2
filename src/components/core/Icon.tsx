import React from 'react';
import {Pressable, StyleProp, StyleSheet, TextStyle} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SvgIcons} from '../../assets/svgs';

// import csv from "!!raw-loader!../../assets/icons/csv_icon.svg";

export type IconType = 'svg' | 'materialCommunity';
export interface IconProps {
  name: string;
  color?: string;
  size?: number;
  type?: IconType;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}
const Icon = ({
  name,
  color,
  size = 20,
  type = 'materialCommunity',
  style,
  onPress,
}: IconProps) => {
  const SvgIcon = SvgIcons[name];
  return type === 'materialCommunity' ? (
    <MaterialIcon
      name={name}
      style={[styles.icon, style]}
      color={color}
      size={size}
      onPress={onPress}
    />
  ) : (
    <SvgIcon
      width={size}
      height={size}
      fill={color}
      style={[styles.icon, style]}
      onPress={onPress}
    />
  );
};

export default React.memo(Icon);

const styles = StyleSheet.create({
  icon: {},
});

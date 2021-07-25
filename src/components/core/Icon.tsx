import React from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SvgIcons} from '../../assets/svgs';

// import csv from "!!raw-loader!../../assets/icons/csv_icon.svg";

interface IconProps {
  name: string;
  color?: string;
  size?: number;
  type?: 'svg' | 'materialCommunity';
  style?: StyleProp<TextStyle>;
}
const Icon = ({
  name,
  color,
  size = 20,
  type = 'materialCommunity',
  style,
}: IconProps) => {
  const SvgIcon = SvgIcons[name];
  return type === 'materialCommunity' ? (
    <MaterialIcon
      name={name}
      style={[styles.icon, style]}
      color={color}
      size={size}
    />
  ) : (
    <SvgIcon
      width={size}
      height={size}
      fill={color}
      style={[styles.icon, style]}
    />
  );
};

export default React.memo(Icon);

const styles = StyleSheet.create({
  icon: {},
});

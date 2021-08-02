import {SvgProps} from 'react-native-svg';
import free from './free.svg';
import filter from './filter.svg';
import React from 'react';

interface SvgIconsType {
  [key: string]: React.FC<SvgProps>;
}
export const SvgIcons: SvgIconsType = {
  free,
  filter,
};

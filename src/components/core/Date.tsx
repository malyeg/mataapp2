import {format} from 'date-fns';
import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {patterns} from '../../config/constants';
import Text from './Text';
interface DateTextProps {
  date: Date;
  pattern?: string;
  style?: StyleProp<TextStyle>;
}
const Date = ({pattern = patterns.DATE, date, style}: DateTextProps) => {
  return <Text style={style}>{format(date, pattern)}</Text>;
};

export default React.memo(Date);

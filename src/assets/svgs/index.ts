import {SvgProps} from 'react-native-svg';
import free from './free.svg';

interface SvgIconsType {
  [key: string]: React.FC<SvgProps>;
}
export const SvgIcons: SvgIconsType = {
  free,
};

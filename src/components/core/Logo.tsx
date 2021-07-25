import React, {FC, useEffect} from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';
import create from '../../styles/EStyleSheet';
import theme from '../../styles/theme';

const logo = require('../../assets/images/logo.png');

interface LogoProps {
  size?: number;
  backgroundColor?: string;
  title?: string;
  showTitle?: boolean;
  lastRefresh?: Date;
  style: StyleProp<ImageStyle>;
}

const Logo: FC<LogoProps> = ({
  size = 100,
  // backgroundColor = '',
  lastRefresh,
  style,
}) => {
  useEffect(() => {}, [lastRefresh]);

  return (
    <Image
      style={[
        styles.logoContainer,
        {
          width: size,
          height: size,
        },
        style,
      ]}
      resizeMode={'contain'}
      source={logo}
    />
  );
};

const styles = create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(Logo);

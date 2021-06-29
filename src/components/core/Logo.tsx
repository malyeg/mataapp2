import React, {FC, useEffect} from 'react';
import {Image, View, ViewProps} from 'react-native';
import create from '../../styles/EStyleSheet';
import theme from '../../styles/theme';

const logo = require('../../assets/images/logo.png');

interface LogoProps extends ViewProps {
  size?: number;
  backgroundColor?: string;
  title?: string;
  showTitle?: boolean;
  lastRefresh?: Date;
}

const Logo: FC<LogoProps> = ({
  size = 150,
  backgroundColor = '',
  lastRefresh,
  style,
}) => {
  useEffect(() => {}, [lastRefresh]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
        style,
      ]}>
      <View
        style={[
          styles.logoContainer,
          {
            width: size,
            height: size,
          },
        ]}>
        <Image resizeMode={'contain'} source={logo} style={styles.image} />
      </View>
    </View>
  );
};

const styles = create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  logoContainer: {
    // overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5.6,
  },
  image: {
    width: '100%',
    height: '100%',
    // margin: 10,
  },
  title: {
    paddingTop: 5,
  },
});

export default React.memo(Logo);

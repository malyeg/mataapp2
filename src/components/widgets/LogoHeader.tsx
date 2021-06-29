import React from 'react';
import {View} from 'react-native';
import Logo from '../core/Logo';

const LogoHeader = () => {
  return (
    <View>
      <Logo size={70} />
    </View>
  );
};

export default React.memo(LogoHeader);

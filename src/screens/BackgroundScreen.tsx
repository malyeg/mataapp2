import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import Screen, {ScreenProps} from '../components/core/Screen';

interface BackgroundScreenProps extends ScreenProps {
  imageBackground: any;
}
const BackgroundScreen = ({
  children,
  imageBackground,
  ...props
}: BackgroundScreenProps) => {
  return (
    <ImageBackground
      style={styles.container}
      source={imageBackground ?? null}
      resizeMode="contain">
      <Screen {...props}>{children}</Screen>
    </ImageBackground>
  );
};

export default React.memo(BackgroundScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

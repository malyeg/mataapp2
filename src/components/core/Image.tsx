import React from 'react';
import {ImageStyle, StyleProp, StyleSheet} from 'react-native';
import FastImage, {ResizeMode, Source} from 'react-native-fast-image';
interface ImageProps {
  uri?: string;
  source?: Source;
  cache?: 'immutable' | 'web' | 'cacheOnly';
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
}

const Image = ({
  style,
  cache,
  source,
  uri,
  resizeMode,
  ...props
}: ImageProps) => {
  const styleList = [styles.image, style];
  return (
    <FastImage
      {...props}
      style={styleList}
      source={
        source ?? {
          uri,
          priority: FastImage.priority.normal,
          cache: cache ?? FastImage.cacheControl.immutable,
        }
      }
      resizeMode={resizeMode ?? FastImage.resizeMode.cover}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    // width: 100,
    // height: 100,
  },
});

export default React.memo(Image);

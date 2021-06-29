import React, {FC} from 'react';
import {ImageStyle, StyleSheet} from 'react-native';
import FastImage, {ResizeMode} from 'react-native-fast-image';
interface ImageProps {
  uri: string;
  cache?: 'immutable' | 'web' | 'cacheOnly';
  style?: ImageStyle;
  resizeMode?: ResizeMode;
}

const Image: FC<ImageProps> = ({style, cache, uri, resizeMode, ...props}) => {
  const styleList = [styles.image, style];
  return (
    <FastImage
      {...props}
      style={styleList}
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: cache ?? FastImage.cacheControl.immutable,
      }}
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

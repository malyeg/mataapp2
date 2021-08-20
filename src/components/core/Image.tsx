import React from 'react';
import {useState} from 'react';
import {ImageStyle, Pressable, StyleProp, StyleSheet} from 'react-native';
import FastImage, {ResizeMode, Source} from 'react-native-fast-image';
import Modal from './Modal';
export interface ImageProps {
  uri?: string;
  source?: Source;
  cache?: 'immutable' | 'web' | 'cacheOnly';
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
  onPressViewInFullScreen?: boolean;
}

const Image = ({
  style,
  cache,
  source,
  uri,
  resizeMode,
  onPressViewInFullScreen = false,
  ...props
}: ImageProps) => {
  const [isVisible, setVisible] = useState(false);
  const styleList = [styles.image, style];
  return onPressViewInFullScreen ? (
    <>
      <Pressable onPress={() => setVisible(true)}>
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
      </Pressable>
      <Modal
        isVisible={isVisible}
        onClose={() => setVisible(false)}
        position="full"
        showHeaderNav>
        <FastImage
          {...props}
          style={styles.fullScreenImage}
          source={
            source ?? {
              uri,
              priority: FastImage.priority.normal,
              cache: cache ?? FastImage.cacheControl.immutable,
            }
          }
          resizeMode={resizeMode ?? FastImage.resizeMode.cover}
        />
      </Modal>
    </>
  ) : (
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
  fullScreenImage: {
    height: '100%',
    width: '100%',
  },
});

export default React.memo(Image);

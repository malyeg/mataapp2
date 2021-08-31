import React, {useState} from 'react';
import {Pressable, StyleProp, StyleSheet} from 'react-native';
import FastImage, {
  ImageStyle,
  ResizeMode,
  Source,
} from 'react-native-fast-image';
import Modal from './Modal';
export interface ImageProps {
  uri?: string;
  source?: Source;
  cache?: 'immutable' | 'web' | 'cacheOnly';
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
  onPressViewInFullScreen?: boolean;
}

// const placeholder = require('../../assets/images/placeholder.png');

const defaultCache = FastImage.cacheControl.immutable;
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
              cache: cache ?? defaultCache,
            }
          }
          resizeMode={resizeMode ?? FastImage.resizeMode.cover}
          // onLoadEnd={onLoadEnd}
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
              cache: cache ?? defaultCache,
            }
          }
          // onLoadStart={() => console.log('load start')}
          // onLoadEnd={() => console.log('load end')}
          resizeMode={FastImage.resizeMode.contain}
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
          cache: cache ?? defaultCache,
        }
      }
      resizeMode={resizeMode ?? FastImage.resizeMode.cover}
      // onLoadEnd={onLoadEnd}
    />
  );
};

// interface ImageComponentProps {
//   source: Source;
//   resizeMode: ResizeMode;
//   style?: StyleProp<ImageStyle>;
//   onLoadEnd?: () => void;
// }
// const ImageComponent = ({
//   source,
//   resizeMode,
//   onLoadEnd,
//   style,
// }: ImageComponentProps) => {
//   return (
//     <FastImage
//       style={style}
//       source={source}
//       resizeMode={resizeMode}
//       onLoadEnd={onLoadEnd}
//     />
//   );
// };

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

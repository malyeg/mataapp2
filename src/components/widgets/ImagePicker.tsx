import storage from '@react-native-firebase/storage';
import React, {FC, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import * as ImagePickerBase from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import itemsApi, {ImageSource} from '../../api/itemsApi';
import useAuth from '../../hooks/useAuth';
import useLocale from '../../hooks/useLocale';
import useMountedRef from '../../hooks/useMountRef';
import useController from '../../hooks/userController';
import theme from '../../styles/theme';
import {Icon, Modal, Separator} from '../core';
import ListItem from '../core/ListItem';
import PressableOpacity from '../core/PressableOpacity';

interface ItemImageProps extends ViewProps {
  name: string;
  control: any;
  source?: ImageSource;
  maxSize?: number;
  defaultValue?: string;
  disabled?: boolean;
  onChange: (imageSource: ImageSource) => void;
  onMaxSize?: (maxSize: number, fileSize: number) => void;
  onImageDelete?: (imageSource: ImageSource) => void;
  onMarkAsDefault?: (imageSource: ImageSource) => void;
  onPress?: () => boolean | void;
  onUpload?: (
    imageSource: ImageSource,
    status: 'started' | 'finished',
  ) => boolean | void;
}

const options: ImagePickerBase.ImageLibraryOptions = {
  mediaType: 'photo',
  maxHeight: 1000,
  maxWidth: 1000,
};

const ImagePicker: FC<ItemImageProps> = ({
  name,
  control,
  source,
  maxSize,
  onChange,
  onMaxSize,
  onImageDelete,
  onMarkAsDefault,
  onUpload,
  defaultValue,
  disabled = false,
  onPress,
  ...props
}) => {
  const [imageSource, setImageSource] = useState<ImageSource>();
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const {user} = useAuth();
  const mounted = useMountedRef();
  const {t} = useLocale('common');
  const {field} = useController({
    control,
    defaultValue,
    name,
  });
  useEffect(() => {
    if (mounted.current && !!source) {
      setImageSource(source);
      field.value = source;
    }
    // methods.control.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const uploadHandler = () => {
    if (disabled) {
      return;
    }
    if (onPress && onPress() === false) {
      return;
    }
    if (imageSource && !imageSource.isTemplate) {
      setModalVisible(true);
      return;
    }
    ImagePickerBase.launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        console.error(
          'ImagePicker Error: ',
          response.errorCode,
          response.errorMessage,
        );
      }
      if (response.assets && response.assets.length > 0) {
        setUploading(true);
        const s: ImageSource = {
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri!,
          size: response.assets[0].fileSize,
          width: response.assets[0].width,
          height: response.assets[0].height,
        };
        upload(s);
      }
    });
  };

  const upload = (is: ImageSource) => {
    resizeImage(is).then(resizedImage => {
      if (onUpload) {
        onUpload(resizedImage!, 'started');
      }
      const task = itemsApi.upload(user.id, resizedImage!);
      task.on(
        storage.TaskEvent.STATE_CHANGED,
        snapshot =>
          console.debug('bytesTransferred', snapshot.bytesTransferred),
        error => console.error(error),
        async () => {
          let downloadURL = await task.snapshot?.ref.getDownloadURL();
          if (downloadURL?.includes('?')) {
            downloadURL =
              downloadURL.substr(0, downloadURL.indexOf('?')) + '?alt=media';
          }
          console.log('downloadURL', downloadURL);
          const newImageSource: ImageSource = {
            ...resizedImage,
            uri: resizedImage?.uri!,
            isTemplate: false,
            downloadURL,
          };

          onChange(newImageSource);
          field.onChange(newImageSource);
          field.value = newImageSource;
          setImageSource(newImageSource);
          if (onUpload) {
            onUpload(newImageSource, 'finished');
          }
          setUploading(false);
        },
      );
    });
  };

  const resizeImage = async (image: ImageSource) => {
    try {
      const response = await ImageResizer.createResizedImage(
        image.uri!,
        600,
        600,
        'JPEG',
        100,
        0,
        undefined,
        false,
        {mode: 'contain', onlyScaleDown: true},
      );
      if (maxSize && onMaxSize && response.size > maxSize) {
        onMaxSize(maxSize, response.size);
        return;
      }
      return {...image, ...response} as ImageSource;
    } catch (error) {
      console.error(error);
      return image;
    }
  };

  const deleteImage = () => {
    setImageSource(undefined);
    // TODO remove from server
    if (!!imageSource && !!imageSource.downloadURL) {
      itemsApi.deleteImage(user.id, imageSource);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <PressableOpacity
        activeOpacity={disabled ? 1 : undefined}
        onPress={uploadHandler}
        style={[styles.container, props.style]}>
        {!!imageSource && !imageSource?.isTemplate ? (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Icon style={styles.addIcon} name="plus" color="white" size={25} />
        )}
        {!!uploading && (
          <View style={styles.uploading}>
            <ActivityIndicator size="large" color={theme.colors.dark} />
          </View>
        )}
      </PressableOpacity>

      <Modal
        position="bottom"
        onClose={closeModal}
        isVisible={isModalVisible}
        title={t('imagePicker.imageAction')}>
        <View style={styles.modalContainer}>
          <ListItem
            text={t('imagePicker.deleteText')}
            icon="trash-can-outline"
            iconColor={theme.colors.salmon}
            onPress={() => {
              if (onImageDelete && imageSource) {
                onImageDelete(imageSource);
                deleteImage();
              }
              setModalVisible(false);
            }}
          />
          <Separator />
          <ListItem
            text={t('imagePicker.markAsDefaultText')}
            style={styles.modalItem}
            icon="check-circle"
            iconColor={theme.colors.green}
            onPress={() => {
              if (onMarkAsDefault && imageSource) {
                onMarkAsDefault(imageSource);
              }
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderColor: theme.colors.grey,
    borderWidth: 0.5,
    backgroundColor: theme.colors.lightGrey,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  addIcon: {
    color: theme.colors.grey,
  },

  uploading: {
    // marginTop: 80,
    position: 'absolute',
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flex: 1,
  },
  statusText: {
    // marginTop: 20,
    fontSize: 10,
  },

  // Modal styles
  modalContainer: {
    paddingBottom: 50,
  },
  safeAreaContainer: {
    flex: 0.5,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 30,
    paddingTop: 30,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalNav: {
    left: 0,
    position: 'absolute',
    marginHorizontal: -20,
  },
  modalTitle: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
    alignSelf: 'center',
    marginVertical: 20,
  },
  modalBodyContainer: {},
  modalItem: {
    // backgroundColor: 'grey',
  },
});

export default React.memo(ImagePicker);

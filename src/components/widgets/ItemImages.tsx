import React, {FC, useEffect, useRef, useState} from 'react';

import {StyleSheet, View, ViewProps} from 'react-native';
import {ImageSource} from '../../api/itemsApi';
import constants from '../../config/constants';
import useController from '../../hooks/userController';
import {Status} from '../../types/DataTypes';
import {Error} from '../form';
import ImagePicker from './ImagePicker';

type TemplateImage = {
  isTemplate: true;
};
const templateImage = {isTemplate: true, uri: ''};
interface ItemImagesProps extends ViewProps {
  name: string;
  items?: ImageSource[];
  defaultImageURL?: string;
  templateSize?: number;
  onChange: (images: ImageSource[], defaultIMage: ImageSource) => void;
  onUploadStart?: (image: ImageSource) => void;
  onUploadFinish?: (image: ImageSource) => void;
  onUpload?: (image: ImageSource, status: 'started' | 'finished') => void;
  control: any;
}
const ItemImages = ({
  name,
  items,
  defaultImageURL,
  onUpload,
  onChange,
  control,
}: ItemImagesProps) => {
  const [images, setImages] = useState<ImageSource[]>([]);
  const [error, setError] = useState<Status>();
  const defaultImage = useRef<ImageSource | null>(null);
  const {field, formState} = useController({
    control,
    defaultValue: undefined,
    name,
  });

  useEffect(() => {
    if (items) {
      setImages([...items]);
      field.onChange([...items]);
    } else {
      setImages([templateImage, templateImage, templateImage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, defaultImageURL]);

  // const updateItemImages = () => {
  //   const filteredImages = images.filter(i => !i.isTemplate);
  //   if (filteredImages && filteredImages.length > 0) {
  //     onChange(images);
  //     field.onChange(images && images.length > 0 ? images : undefined);
  //   } else {
  //     onChange(undefined!);
  //     field.onChange(undefined);
  //   }
  // };

  const onImagesChange = (imageArray: ImageSource[]) => {
    const filteredImages = imageArray.filter(i => !i.isTemplate);
    if (onChange) {
      onChange(filteredImages, defaultImage.current ?? images[0]);
    }
    field.onChange(filteredImages);
    // updateItemImages();
  };

  const onAddImage = (imageSource: ImageSource, index: number) => {
    setImages(imageArray => {
      imageArray[index] = imageSource;
      // const newImages = [...imageArray, imageSource];
      onImagesChange(imageArray);
      return imageArray;
    });
  };

  const onImageDelete = (image: ImageSource, index: number) => {
    images[index] = templateImage;

    setImages(imageArray => {
      imageArray[index] = templateImage;
      if (image.downloadURL === defaultImage.current?.downloadURL) {
        defaultImage.current = null;
      }
      onImagesChange(imageArray);
      return imageArray;
    });
  };
  const onMarkAsDefault = (image: ImageSource) => {
    console.log('onMarkAsDefault', image);
    defaultImage.current = image;
    onImagesChange(images);
  };

  const onMaxSize = () => {
    const maxSizeparam = `${
      constants.firebase.MAX_IMAGE_SIZE / 1000 / 1000
    } MB`;
    setError({
      code: 'storage/imageMaxSize',
      message: 'imageMaxSize reached',
      type: 'error',
      params: {maxSize: maxSizeparam},
    });
  };

  const uploadHandler = (
    image: ImageSource,
    status: 'started' | 'finished',
  ) => {
    setError(undefined);
    if (onUpload) {
      onUpload(image, status);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {images?.map((item, index) => (
          <ImagePicker
            key={index}
            source={item}
            name={'image' + index}
            control={control}
            onChange={image => onAddImage(image, index)}
            style={[
              styles.image,
              index === 0 || index === images.length - 1
                ? null
                : styles.centerImage,
            ]}
            maxSize={constants.firebase.MAX_IMAGE_SIZE}
            onMaxSize={onMaxSize}
            onImageDelete={image => onImageDelete(image, index)}
            onMarkAsDefault={onMarkAsDefault}
            onUpload={uploadHandler}
          />
        ))}
      </View>
      <Error style={styles.error} error={error ?? formState.errors[name]} />
    </View>
  );
};

export default React.memo(ItemImages);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  image: {
    // flex: 1,
    // marginHorizontal: 5,
  },
  centerImage: {
    marginHorizontal: 10,
  },
  error: {
    marginTop: 10,
  },
});

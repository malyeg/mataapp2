import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import * as yup from 'yup';
import categoriesApi from '../api/categoriesApi';
import itemsApi, {
  ConditionType,
  ImageSource,
  Item,
  SwapType,
} from '../api/itemsApi';
import {Button} from '../components/core';
import PressableScreen from '../components/core/PressableScreen';
import {CheckBox, Picker, TextInput} from '../components/form';

import ItemConditionPicker from '../components/widgets/ItemConditionPicker';
import ItemImages from '../components/widgets/ItemImages';
import LocationSelector from '../components/widgets/LocationSelector';
import swapTypes from '../data/swapTypes';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import {Location} from '../types/DataTypes';

type AddItemFormValues = {
  name: string;
  category: string;
  conditionType: ConditionType;
  usedWithIssuesDesc?: string;
  description?: string;
  location?: Location;
  images: ImageSource[];
  swapType: SwapType;
  swapCategory: string;
  status: boolean;
};

const AddItemScreen = () => {
  const {t} = useLocale('addItemScreen');
  const defaultImage = useRef<ImageSource | null>(null);
  const [swapType, setSwapType] = useState<SwapType | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const uploadSet = useRef(new Set()).current;
  const {loader, request} = useApi();
  const {user, profile, addTargetCategory} = useAuth();
  const {showToast, hideToast} = useToast();

  const {control, reset, handleSubmit, setValue} = useForm<AddItemFormValues>({
    name: yup.string().trim().max(50).required(t('name.required')),
    category: yup.string().trim().required(t('category.required')),
    conditionType: yup.string().trim().required(t('status.required')),
    images: yup
      .array()
      .required(t('images.required'))
      .min(1, t('images.required')),
    description: yup.string().max(200),
    location: yup.object().required(t('location.required')),
    usedWithIssuesDesc: yup.string().max(200),
    swapType: yup.string(),
    swapCategory: yup
      .string()
      .test('swapCategory', t('swapCategory.required'), function (value) {
        if (this.parent.swapType === ('swapWithAnother' as SwapType)) {
          return !!value;
        }
        return true;
      }),
  });

  const onFormError = async (data: any) => {
    console.log('onFormError', data);
  };

  const onFormSuccess = async (data: AddItemFormValues) => {
    try {
      hideToast();
      const item: Omit<Item, 'id'> = {
        name: data.name,
        category: categoriesApi.getAll().find(c => c.id === data.category)!,
        condition: {
          type: data.conditionType,
        },
        description: data.description,
        images: data.images
          ?.filter(image => !image.isTemplate)
          .map(image => {
            const newImage = {...image};
            delete newImage.uri;
            return newImage;
          }),
        defaultImageURL:
          defaultImage.current?.downloadURL ?? data.images[0].downloadURL,
        location: data.location,
        userId: user.id,
        status: data.status === true ? 'draft' : 'online',
        swapOption: {
          type: data.swapType,
        },
      };
      !!data.usedWithIssuesDesc &&
        (item.condition.desc = data.usedWithIssuesDesc);
      const evict = `${itemsApi.MY_ITEMS_CACHE_KEY}_${user.id}`;

      await request<Item>(() =>
        itemsApi.add(item, {
          cache: {
            enabled: false,
            evict,
          },
        }),
      );
      if (profile && profile.targetCategories && item.swapOption.category) {
        const found = profile.targetCategories.find(
          c => c === item.swapOption.category,
        );
        if (!found) {
          addTargetCategory(item.swapOption.category);
        }
      }
      reset();
      showToast({
        type: 'success',
        message: t('addItemSuccess'),
        options: {
          duration: 5000,
        },
      });
    } catch (err) {
      console.error(err);
      showToast({
        code: err.code,
        message: err.message,
        type: 'error',
      });
    }
  };

  const onItemImagesChange = (
    itemImages: ImageSource[],
    defaultImg?: ImageSource,
  ) => {
    if (defaultImg) {
      defaultImage.current = defaultImg;
    }
  };

  const uploadHandler = useCallback(
    (image: ImageSource, status: 'started' | 'finished') => {
      console.log('size', uploadSet.size);
      if (status === 'started') {
        uploadSet.add(image.name!);
        setUploading(true);
      } else {
        uploadSet.delete(image.name!);
        console.log('size after delete', uploadSet.size);
        if (uploadSet.size === 0) {
          setUploading(false);
        } else {
          console.log('in else', uploadSet.size);
        }
      }
    },
    [uploadSet],
  );

  const onSwapChange = useCallback((value: string) => {
    setSwapType(value as SwapType);
  }, []);

  const categories = useMemo(() => categoriesApi.getAll(), []);

  return (
    <PressableScreen style={styles.screen} scrollable>
      <ItemImages
        name="images"
        onChange={onItemImagesChange}
        templateSize={3}
        onUpload={uploadHandler}
        control={control}
      />

      <TextInput
        name="name"
        placeholder={t('name.placeholder')}
        returnKeyType="next"
        control={control}
      />
      <TextInput
        name="description"
        placeholder={t('description.placeholder')}
        returnKeyType="next"
        control={control}
      />

      {/* <CategoryPicker control={control} /> */}
      <Picker
        name="category"
        items={categories}
        placeholder="Category"
        modalTitle="Category"
        control={control}
        multiLevel
      />

      <ItemConditionPicker name="conditionType" control={control} label="" />

      <Picker
        position="bottom"
        name={'swapType'}
        items={swapTypes}
        placeholder="Swap type"
        modalTitle="Swap Type"
        control={control}
        onChange={onSwapChange}
      />

      {swapType === 'swapWithAnother' && (
        <Picker
          name="swapCategory"
          items={categories}
          placeholder="Swap category"
          modalTitle="Swap category"
          control={control}
          multiLevel
        />
      )}

      <LocationSelector style={styles.location} control={control} />

      <CheckBox
        style={styles.draftCheckBox}
        control={control}
        name="status"
        label={t('status.saveAsDraftLabel')}
      />

      <Button
        title={t('submitBtnTitle')}
        style={styles.submit}
        disabled={uploading}
        onPress={handleSubmit(onFormSuccess, onFormError)}
      />
      {loader}
    </PressableScreen>
  );
};

export default AddItemScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingBottom: 10,
  },
  form: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  imagesContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  submit: {
    // marginVertical: 10,
  },
  location: {
    // flex: 1,
    marginTop: 5,
  },
  radioGroup: {
    // flexGrow: 0.5,
    // flexShrink: 1,
    // flex: 0.5,
    justifyContent: 'space-between',
    paddingRight: '20%',
    // backgroundColor: 'grey',
  },
  draftCheckBox: {
    marginVertical: 5,
  },
});

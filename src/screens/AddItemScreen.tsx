import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {screens} from '../config/constants';
import swapTypes from '../data/swapTypes';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import {StackParams} from '../navigation/HomeStack';
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

type EditItemRoute = RouteProp<StackParams, typeof screens.EDIT_ITEM>;

const AddItemScreen = () => {
  const {t} = useLocale('addItemScreen');
  const defaultImage = useRef<ImageSource | null>(null);
  const [swapType, setSwapType] = useState<SwapType | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const uploadSet = useRef(new Set()).current;
  const {loader, request} = useApi();
  const {user, profile, addTargetCategory, getName} = useAuth();
  const {showToast, hideToast} = useToast();
  const navigation = useNavigation<StackNavigationHelpers>();
  const {control, reset, handleSubmit, setFocus} = useForm<AddItemFormValues>({
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
    swapType: yup.string().required(t('swapType.required')),
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
        user: {
          id: user.id,
          name: getName(),
          email: profile?.email ?? user.username,
          isProfilePublic: profile?.isPublic ?? false,
        },
        status: data.status === true ? 'draft' : 'online',
        swapOption: {
          type: data.swapType,
        },
      };
      !!data.swapCategory && (item.swapOption.category = data.swapCategory);
      !!data.usedWithIssuesDesc &&
        (item.condition.desc = data.usedWithIssuesDesc);
      const evict = `${itemsApi.MY_ITEMS_CACHE_KEY}_${user.id}`;

      const newItem = await request<Item>(() =>
        itemsApi.add(item, {
          cache: {
            enabled: false,
            evict,
          },
        }),
      );

      if (profile && !!item.swapOption.category) {
        if (profile.targetCategories && profile.targetCategories.length > 0) {
          const found = profile.targetCategories.find(
            c => c === item.swapOption.category,
          );
          if (!found) {
            addTargetCategory(item.swapOption.category);
          }
        } else {
          addTargetCategory(item.swapOption.category);
        }
      }
      reset();
      // showToast({
      //   type: 'success',
      //   message: t('addItemSuccess'),
      //   options: {
      //     duration: 5000,
      //   },
      // });
      navigation.navigate(screens.ITEM_DETAILS, {
        id: newItem.id,
        toast: {
          type: 'success',
          message: t('addItemSuccess'),
          options: {
            duration: 5000,
          },
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
      if (status === 'started') {
        uploadSet.add(image.name!);
        setUploading(true);
      } else {
        uploadSet.delete(image.name!);
        if (uploadSet.size === 0) {
          setUploading(false);
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
    <PressableScreen style={styles.screen}>
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
        onSubmitEditing={() => setFocus('description')}
      />
      <TextInput
        name="description"
        placeholder={t('description.placeholder')}
        returnKeyType="next"
        control={control}
      />

      <Picker
        name="category"
        items={categories}
        placeholder={t('category.placeholder')}
        modalTitle={t('category.modalTitle')}
        control={control}
        multiLevel
      />

      <ItemConditionPicker name="conditionType" control={control} label="" />

      <Picker
        position="bottom"
        name="swapType"
        items={swapTypes}
        placeholder={t('swapType.placeholder')}
        modalTitle={t('swapType.modalTitle')}
        control={control}
        onChange={onSwapChange}
      />

      {swapType === 'swapWithAnother' && (
        <Picker
          name="swapCategory"
          items={categories}
          placeholder={t('swapCategory.placeholder')}
          modalTitle={t('swapCategory.modalTitle')}
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
  location: {
    marginTop: 5,
  },
  radioGroup: {
    justifyContent: 'space-between',
    paddingRight: '20%',
  },
  draftCheckBox: {
    marginVertical: 5,
  },
});

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import * as yup from 'yup';
import categoriesApi from '../../../api/categoriesApi';
import {Item, SwapType} from '../../../api/itemsApi';
import swapTypes from '../../../data/swapTypes';
import useForm from '../../../hooks/useForm';
import useLocale from '../../../hooks/useLocale';
import theme from '../../../styles/theme';
import {Filter, Operation} from '../../../types/DataTypes';
import {Button, Modal, Text} from '../../core';
import Icon from '../../core/Icon';
import {Picker} from '../../form';

interface ItemsFilterProps {
  onChange: (filters: Filter<Item>[] | undefined) => void;
  style?: StyleProp<ViewStyle>;
  filters?: Filter<Item>[];
}
interface ItemsFilterFormValues {
  category: string;
  swapType: string;
  swapCategory: string;
}
const ItemsFilter = ({filters, onChange, style}: ItemsFilterProps) => {
  const [swapType, setSwapType] = useState<SwapType | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const {t} = useLocale('widgets');
  const {control, handleSubmit, formState, setValue, reset} =
    useForm<ItemsFilterFormValues>({
      category: yup.string().trim(),
      swapType: yup.string().trim(),
      swapCategory: yup.string().trim(),
    });

  useEffect(() => {
    if (filters) {
      setValue(
        'category',
        filters.find(f => f.field === 'category.path')?.value,
      );
      setValue(
        'swapType',
        filters.find(f => f.field === 'swapOption.type')?.value,
      );
      setValue(
        'swapCategory',
        filters.find(f => f.field === 'swapOption.category')?.value,
      );
    }
  }, [filters, setValue]);

  // const defaultData = useMemo(() => {
  //   return filters
  //     ? {
  //         category: filters.find(f => f.field === 'category.path')?.value,
  //         swapType: filters.find(f => f.field === 'swapOption.type')?.value,
  //         swapCategory: filters.find(f => f.field === 'swapOption.category')
  //           ?.value,
  //       }
  //     : undefined;
  // }, [filters]);

  const onOpenModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const onSubmit = (data: ItemsFilterFormValues) => {
    console.log('data', data);
    const newFilters: Filter<Item>[] = [];
    !!data.category &&
      newFilters.push({
        field: 'category.path',
        operation: Operation.CONTAINS,
        value: data.category,
      });
    !!data.swapType &&
      newFilters.push({field: 'swapOption.type', value: data.swapType});
    !!data.swapCategory &&
      newFilters.push({field: 'swapOption.category', value: data.swapCategory});
    onChange(newFilters);
    if (!newFilters || newFilters.length === 0) {
      console.log('resetting form');
      reset();
    }

    setModalVisible(false);
  };

  const onSwapChange = useCallback((value: string) => {
    setSwapType(value as SwapType);
  }, []);

  const onReset = useCallback(
    (name: string) => {
      console.log('name', name);
      setValue(name as keyof ItemsFilterFormValues, '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      // reset({[name]: ''}, {keepValues: true});
    },

    [setValue],
  );

  return (
    <>
      <Pressable style={[styles.container, style]} onPress={onOpenModal}>
        <Text style={styles.label}>Filter</Text>
        <Icon
          // name={formState.isDirty ? 'filter-plus-outline' : 'filter-outline'}
          name={formState.isDirty ? 'filter' : 'filter'}
          size={30}
          color={theme.colors.dark}
          onPress={onOpenModal}
          type="svg"
        />
      </Pressable>
      <Modal
        position="full"
        isVisible={isModalVisible}
        showHeaderNav={true}
        title="Items Filter"
        containerStyle={styles.modal}
        onClose={() => setModalVisible(false)}>
        <View style={styles.form}>
          <Picker
            name="category"
            items={categoriesApi.getAll()}
            placeholder={t('itemsFilter.category.placeholder')}
            modalTitle={t('itemsFilter.category.modalTitle')}
            // defaultValue={defaultData?.category}
            control={control}
            multiLevel
            showReset
            onReset={onReset}
          />
          <Picker
            name="swapType"
            items={swapTypes}
            onChange={onSwapChange}
            placeholder={t('itemsFilter.swapType.placeholder')}
            modalTitle={t('itemsFilter.swapType.modalTitle')}
            control={control}
            position="bottom"
            // defaultValue={defaultData?.swapType}
            showReset
            onReset={onReset}
          />
          {swapType === 'swapWithAnother' && (
            <Picker
              name="swapCategory"
              items={categoriesApi.getAll()}
              placeholder={t('itemsFilter.swapCategory.placeholder')}
              modalTitle={t('itemsFilter.swapCategory.modalTitle')}
              control={control}
              multiLevel
              // defaultValue={defaultData?.swapCategory}
              showReset
              onReset={onReset}
            />
          )}
        </View>
        <View style={styles.footer}>
          <Button
            title={t('itemsFilter.showResultsBtnTitle')}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </Modal>
    </>
  );
};

export default React.memo(ItemsFilter);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    // flex: 1,
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  label: {
    marginRight: 10,
  },
  footer: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: 20,
    // flex: 1,
  },
});

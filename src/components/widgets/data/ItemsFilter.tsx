import React, {useCallback, useMemo, useState} from 'react';
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
}
interface ItemsFilterFormValues {
  category: string;
  swapType: string;
  swapCategory: string;
}
const ItemsFilter = ({onChange, style}: ItemsFilterProps) => {
  const [swapType, setSwapType] = useState<SwapType | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const {t} = useLocale('widgets');
  const {control, handleSubmit, formState, setValue, reset} =
    useForm<ItemsFilterFormValues>({
      category: yup.string().trim(),
      swapType: yup.string().trim(),
      swapCategory: yup.string().trim(),
    });

  const onOpenModal = useCallback(() => {
    setModalVisible(true);
    // setState(s => !s);
  }, []);

  const categories = useMemo(() => categoriesApi.getAll(), []);

  const onSubmit = (data: ItemsFilterFormValues) => {
    const filters: Filter<Item>[] = [];
    !!data.category &&
      filters.push({
        field: 'category.path',
        operation: Operation.CONTAINS,
        value: data.category,
      });
    !!data.swapType &&
      filters.push({field: 'swapOption.type', value: data.swapType});
    !!data.swapCategory &&
      filters.push({field: 'swapOption.category', value: data.swapCategory});
    onChange(filters);
    setModalVisible(false);
    if (!filters || filters.length === 0) {
      console.log('resetting form');
      reset();
    }
    console.log('formState.isDirty', formState.isDirty);
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
          {/* <Picker
            name="city"
            items={[profile?.city as Entity]}
            placeholder={t('itemsFilter.city.placeholder')}
            modalTitle={t('itemsFilter.city.modalTitle')}
            disabled
            defaultValue={profile?.city?.id.toString()}
            control={control}
            multiLevel
          /> */}
          <Picker
            name="category"
            items={categories}
            placeholder={t('itemsFilter.category.placeholder')}
            modalTitle={t('itemsFilter.category.modalTitle')}
            // defaultValue={}
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
            showReset
            onReset={onReset}
          />
          {swapType === 'swapWithAnother' && (
            <Picker
              name="swapCategory"
              items={categories}
              placeholder={t('itemsFilter.swapCategory.placeholder')}
              modalTitle={t('itemsFilter.swapCategory.modalTitle')}
              control={control}
              multiLevel
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

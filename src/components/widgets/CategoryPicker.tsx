import React, {useMemo} from 'react';
import categoriesApi from '../../api/categoriesApi';
import {FormProps} from '../../types/DataTypes';
import {Picker} from '../form';

interface CategoryPickerProps extends Omit<FormProps, 'name'> {
  name?: string;
  searchable?: boolean;
}
const CategoryPicker = ({
  name,
  control,
  searchable = false,
}: CategoryPickerProps) => {
  const categories = useMemo(() => categoriesApi.getAll(), []);

  // const onCategorySelectHandler = (categoryId: string) => {};
  return (
    <Picker
      searchable={searchable}
      name={name ?? 'category'}
      items={categories} // TODO fix type casting
      placeholder="Category"
      modalTitle="Category"
      control={control}
      // onChange={onCategorySelectHandler}
      multiLevel
    />
  );
};

export default CategoryPicker;

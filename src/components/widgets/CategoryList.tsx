import React, {useState} from 'react';
import {FlatList, StyleSheet, View, ViewStyle} from 'react-native';
import categoriesApi, {Category} from '../../api/categoriesApi';
import theme from '../../styles/theme';
import {Text} from '../core';
import PressableObacity from '../core/PressableObacity';

interface CategoryListProps {
  horizontal: boolean;
  onChange: (category: Category) => void;
  style?: ViewStyle;
}
const allItemsCategory: Category = {id: '0', name: 'All items', group: ''};
const CategoryList = ({horizontal, onChange, style}: CategoryListProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>(allItemsCategory);
  const categories: Category[] = [
    allItemsCategory,
    ...categoriesApi
      .getAll()
      .filter(i => i.level === 0 || i.id.toString() === '0'),
  ];
  const onSelect = (category: Category) => {
    setSelectedCategory(category);
    onChange(category);
  };
  // console.log(categories);

  const renderItem = ({item}: {item: Category}) => (
    <PressableObacity
      onPress={() => onSelect(item)}
      style={[
        styles.itemContainer,
        selectedCategory?.id === item.id ? styles.active : undefined,
      ]}>
      {/* <Text>asdfasdf</Text> */}
      <Text
        numberOfLines={1}
        style={[
          styles.categoryText,
          selectedCategory?.id === item.id ? styles.activeText : undefined,
        ]}>
        {item.name}
      </Text>
    </PressableObacity>
  );
  return (
    <View style={[styles.container, style]}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
        data={categories}
        horizontal={horizontal}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default React.memo(CategoryList);

const styles = StyleSheet.create({
  container: {
    height: 40,
    // backgroundColor: 'red',
  },
  flatList: {
    flexGrow: 0,
  },
  itemContainer: {
    width: 120,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: theme.colors.dark,
  },
  activeText: {
    color: theme.colors.white,
  },
  categoryText: {
    ...theme.styles.scale.body2,
  },
  separator: {
    width: 10,
  },
});

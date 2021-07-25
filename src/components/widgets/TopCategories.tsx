import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import categoriesApi from '../../api/categoriesApi';
import {screens} from '../../config/constants';
import theme from '../../styles/theme';
import {Text} from '../core';
import PressableObacity from '../core/PressableObacity';

interface TopCategoriesProps extends ViewProps {}
const categories = categoriesApi
  .getAll()
  .filter(category => category.level === 0);

const TopCategories = ({style}: TopCategoriesProps) => {
  const navigation = useNavigation();
  const onPress = useCallback(
    (categoryId: string) => {
      navigation.navigate(screens.ITEMS, {categoryId});
    },
    [navigation],
  );
  return (
    <View style={[styles.container, style]}>
      {categories.map(category => (
        <PressableObacity
          onPress={() => onPress(category.id)}
          key={category.id}
          style={styles.categoryContainer}>
          <View
            style={[
              styles.category,
              {backgroundColor: category.style?.bgColor},
            ]}>
            <Icon
              name={category.style?.iconName ?? 'home'}
              // color="#F2A39C"
              color="white"
              size={35}
            />
          </View>
          <Text style={styles.name}>{category.name}</Text>
        </PressableObacity>
      ))}
    </View>
  );
};

export default React.memo(TopCategories);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  categoryContainer: {
    alignItems: 'center',
  },
  category: {
    backgroundColor: 'grey',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    ...theme.styles.scale.body3,
    paddingTop: 7,
  },
});

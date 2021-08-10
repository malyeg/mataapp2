import {useNavigation} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import categoriesApi from '../../api/categoriesApi';
import {screens, stacks} from '../../config/constants';
import theme from '../../styles/theme';
import {Text} from '../core';
import PressableOpacity from '../core/PressableOpacity';

interface TopCategoriesProps extends ViewProps {}
const categories = categoriesApi
  .getAll()
  .filter(category => category.level === 0);

const TopCategories = ({style}: TopCategoriesProps) => {
  const navigation = useNavigation<StackNavigationHelpers>();

  const renderItem = useCallback(
    ({item}) => (
      <PressableOpacity
        onPress={() => {
          navigation.navigate(stacks.ITEMS_STACK, {
            screen: screens.ITEMS,
            params: {categoryId: item.id},
          });
        }}
        key={item.id}
        style={styles.categoryContainer}>
        <View style={[styles.category, {backgroundColor: item.style?.bgColor}]}>
          <Icon
            name={item.style?.iconName ?? 'home'}
            // color="#F2A39C"
            color="white"
            size={35}
          />
        </View>
        <Text style={styles.name}>{item.name}</Text>
      </PressableOpacity>
    ),
    [navigation],
  );
  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
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

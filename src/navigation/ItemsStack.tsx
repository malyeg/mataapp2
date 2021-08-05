import {RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import {ItemStatus} from '../api/itemsApi';
import Header from '../components/widgets/Header';
import {screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import AddItemScreen from '../screens/AddItemScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import ItemsScreen from '../screens/ItemsScreen';
import MyItemsScreen from '../screens/MyItemsScreen';

const screenOptions: StackNavigationOptions = {
  headerShown: true,
  header: props => (
    <Header title={props.options.headerTitle as string} {...props} />
  ),
};
export type StackParams = {
  [screens.ITEMS]:
    | {
        categoryId: string;
        swapType: string;
        conditionType: string;
        status: ItemStatus;
        userId: string;
        city: string;
      }
    | undefined;
  [screens.MY_ITEMS]: undefined;
  [screens.ADD_ITEM]: undefined;
  [screens.ITEM_DETAILS]: {id: string} | undefined;
};
export type ItemDetailsRouteProp = RouteProp<
  StackParams,
  typeof screens.ITEM_DETAILS
>;
export type MyItemsRouteProp = RouteProp<StackParams, typeof screens.MY_ITEMS>;
export type ItemsRouteProp = RouteProp<StackParams, typeof screens.ITEMS>;
const Stack = createStackNavigator();

const ItemsStack = () => {
  const {t} = useLocale('common');
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={screens.ITEMS}
        component={ItemsScreen}
        options={{headerTitle: t('screens.items')}}
      />
      <Stack.Screen
        name={screens.MY_ITEMS}
        component={MyItemsScreen}
        options={{headerTitle: t('screens.myItems')}}
      />
      <Stack.Screen
        name={screens.ITEM_DETAILS}
        component={ItemDetailsScreen}
        options={({route}) => ({
          headerTitle: (route.params as any)?.title ?? t('screens.itemDetails'),
        })}
      />
    </Stack.Navigator>
  );
};

export default ItemsStack;

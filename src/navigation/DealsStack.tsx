import {RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import Header from '../components/widgets/Header';
import {screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import DealDetailsScreen from '../screens/DealDetailsScreen';
import DealsTabs from './DealsTabs';

const screenOptions: StackNavigationOptions = {
  headerShown: true,
  header: props => (
    <Header title={props.options.headerTitle as string} {...props} />
  ),
};
export type StackParams = {
  [screens.DEALS_TABS]: undefined;
  [screens.DEAL_DETAILS]: undefined;
};
export type DealDetailsRouteProp = RouteProp<
  StackParams,
  typeof screens.DEAL_DETAILS
>;

const Stack = createStackNavigator();

const DealsStack = () => {
  const {t} = useLocale('common');
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={screens.DEALS_TABS}>
      <Stack.Screen
        name={screens.DEALS_TABS}
        component={DealsTabs}
        options={{headerTitle: t('screens.deals')}}
      />
      <Stack.Screen
        name={screens.DEAL_DETAILS}
        component={DealDetailsScreen}
        options={{headerTitle: t('screens.dealDetails')}}
      />
    </Stack.Navigator>
  );
};

export default DealsStack;

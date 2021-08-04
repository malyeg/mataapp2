import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import Header from '../components/widgets/Header';
import {screens} from '../config/constants';
import useLocale from '../hooks/useLocale';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';

const screenOptions: StackNavigationOptions = {
  headerShown: true,
  header: props => (
    <Header title={props.options.headerTitle as string} {...props} />
  ),
};

const Stack = createStackNavigator();

const ProfileStack = () => {
  const {t} = useLocale('common');
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={screens.PROFILE}>
      <Stack.Screen
        name={screens.PROFILE}
        component={ProfileScreen}
        options={{headerTitle: t('screens.profile')}}
      />
      <Stack.Screen
        name={screens.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{headerTitle: t('screens.editProfile')}}
      />
      <Stack.Screen
        name={screens.CHANGE_PASSWORD}
        component={ChangePasswordScreen}
        options={{headerTitle: t('screens.changePassword')}}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;

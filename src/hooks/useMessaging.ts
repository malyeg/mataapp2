import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import profilesApi from '../api/profileApi';
import useAuth from './useAuth';

// https://github.com/react-navigation/react-navigation/pull/8987
const useMessaging = () => {
  // const {user, profile} = useAuth();

  // const updateToken = (token: string) => {
  //   if (!profile?.token || profile?.token !== token) {
  //     return profilesApi.update({
  //       id: user.id,
  //       token,
  //     });
  //   }
  // };

  const getToken = async () => {
    try {
      if (
        Platform.OS === 'ios' &&
        !messaging().isDeviceRegisteredForRemoteMessages
      ) {
        await messaging().registerDeviceForRemoteMessages();
      }
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.warn('couldnt get token', error);
    }
  };

  const onTokenRefresh = (callback: (token: string) => void) => {
    return messaging().onTokenRefresh(token => {
      callback(token);
    });
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('Authorization status:', authStatus);
    return enabled;
  };

  return {
    requestUserPermission,
    getToken,
    onTokenRefresh,
    // subscribe,
  };
};

export default useMessaging;

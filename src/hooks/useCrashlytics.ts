import crashlytics from '@react-native-firebase/crashlytics';
import DeviceInfo from 'react-native-device-info';
import {User} from '../contexts/user-model';

// https://invertase.io/blog/react-native-firebase-crashlytics-configuration
const useCrashlytics = () => {
  const setUser = async (user: User) => {
    await Promise.all([
      crashlytics().setUserId(user.id),
      crashlytics().setAttribute('user', JSON.stringify(user)),
      crashlytics().setAttribute('buildNumber', DeviceInfo.getBuildNumber()),
      crashlytics().setAttribute('bundleId', DeviceInfo.getBundleId()),
      crashlytics().setAttribute('deviceType', DeviceInfo.getDeviceType()),
      crashlytics().setAttribute('deviceModel', DeviceInfo.getModel()),
      crashlytics().setAttribute('isTablet', `${DeviceInfo.isTablet()}`),
    ]);
  };

  const crash = () => {
    crashlytics().crash();
  };

  const log = (message: string) => {
    crashlytics().log(message);
  };

  return {setUser, crash, log};
};

export default useCrashlytics;

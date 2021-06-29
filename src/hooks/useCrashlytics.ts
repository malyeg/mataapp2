import crashlytics from '@react-native-firebase/crashlytics';
import {User} from '../contexts/user-model';

const useCrashlytics = () => {
  const setUser = async (user: User) => {
    await Promise.all([
      crashlytics().setUserId(user.id),
      crashlytics().setAttribute('user', JSON.stringify(user)),
      //   crashlytics().setAttributes(user),
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

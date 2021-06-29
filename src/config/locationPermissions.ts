import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {LoggerFactory} from '../utils/logger';

const logger = LoggerFactory.getLogger('locationPermissions');

const requestAndroidLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      logger.debug('location permission granted');
    } else {
      logger.warn('location permission denied');
    }
  } catch (err) {
    logger.error(err);
  }
};

const requestIOSLocationPermission = async () => {
  const auth = await Geolocation.requestAuthorization('whenInUse');
  if (auth === 'granted') {
    // do something if granted...
  }
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    await requestAndroidLocationPermission();
  } else if (Platform.OS === 'ios') {
    await requestIOSLocationPermission();
  }
};

const requestLocationPermissions = async () => {
  await requestLocationPermission();
};

export {requestLocationPermissions};

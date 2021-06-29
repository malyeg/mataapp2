import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {I18nManager, Platform} from 'react-native';
import Config from 'react-native-config';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocoder from 'react-native-geocoding';
import constants from '../config/constants';
import i18n from '../config/i18n';
import {Locale} from '../contexts/LocalizationContext';
import {LoggerFactory} from '../utils/logger';
import useConfig from './useConfig';
import useMessaging from './useMessaging';

const logger = LoggerFactory.getLogger('useResources');

const syncRTL = async () => {
  try {
    const storedLocale = await AsyncStorage.getItem(
      constants.locale.STORAGE_NAME,
    );

    if (!!storedLocale && storedLocale !== i18n.language) {
      logger.debug('storedLocale: stored locale found', storedLocale);
      await i18n.changeLanguage(storedLocale);
      await I18nManager.forceRTL(storedLocale === Locale.AR);
    } else {
      logger.debug('storedLocale: no locale stored, proceeding with default');
      await i18n.changeLanguage(constants.locale.DEFAULT_LANGUAGE);
      await I18nManager.forceRTL(
        constants.locale.DEFAULT_LANGUAGE === Locale.AR,
      );
    }
  } catch (error) {
    logger.error(error);
  }
};

export default function useResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const {fetchConfig} = useConfig();

  useEffect(() => {
    logger.debug('useEffect');
    const loadResourcesAndDataAsync = async () => {
      try {
        await Promise.all([
          syncRTL(),
          fetchConfig(60),
          Icons.loadFont(),
          Geocoder.init(
            Platform.OS === 'ios'
              ? Config.GOOGLE_MAPS_IOS_API_KEY
              : Config.GOOGLE_MAPS_ANDROID_API_KEY,
          ),
        ]);
      } catch (e) {
        logger.error(e);
        // TODO handle loading app error
      } finally {
        setLoadingComplete(true);
      }
    };

    const loadResourcesSync = async () => {
      try {
        // await Promise.all([getToken()]);
      } catch (e) {
        logger.error(e); //TODO report to backend
      }
    };

    // Async jobs
    loadResourcesAndDataAsync();

    // sync jobs
    loadResourcesSync();

    // background jobs
    // let watchId: number;
    // initLocation().then(value => {
    //   if (value) {
    //     watchId = value;
    //   }
    // });

    return () => {
      // stopLocationObserving(watchId);
      // return subscriber;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {isLoadingComplete};
}

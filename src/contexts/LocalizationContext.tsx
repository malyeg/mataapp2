import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {I18nManager} from 'react-native';
import Toaster from '../components/core/Toaster';
import constants from '../config/constants';
import {Status} from '../types/DataTypes';
import {LoggerFactory} from '../utils/logger';

export enum Locale {
  EN = 'en',
  AR = 'ar',
}

export interface ILocalizationContextModel {
  t: (key: string, options?: any) => string;
  locale: string;
  supportedLocales: string[];
  toggleLocale: (forceRestart?: boolean) => void;
  showToast: (t: Status) => void;
  hideToast: () => void;
}

const logger = LoggerFactory.getLogger('LocalizationContext');
const LocalizationContext = createContext({} as ILocalizationContextModel);

const restart = () => {
  // RNRestart.Restart();
};
const LocalizationProvider: React.FC = ({children}) => {
  const [tr, i18n] = useTranslation();
  const [locale, setLocale] = React.useState(i18n.language);
  const [toast, setToast] = useState<Status | undefined>();

  const updateLocale = async (loc: string, forceRestart: boolean = false) => {
    logger.debug('setLocale: locale before', loc);
    await setLocale(loc);
    await i18n.changeLanguage(loc);
    await AsyncStorage.setItem(constants.locale.STORAGE_NAME, loc);
    await I18nManager.forceRTL(loc === Locale.AR);
    !!forceRestart && (await restart());
  };

  const toggleLocale = async (forceRestart: boolean = true) => {
    try {
      logger.debug('toggleLocale: language is', locale);
      if (locale === Locale.EN) {
        await updateLocale(Locale.AR, forceRestart);
      } else {
        await updateLocale(Locale.EN, forceRestart);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getToastMessage = (status: Status) => {
    if (typeof status === 'string') {
      return status;
    } else if (status?.code) {
      const localizedMessage = tr('error:' + status.code, {
        defaultValue: status.message,
      });
      return localizedMessage;
    } else if (status?.message) {
      return status.message;
    } else {
      return JSON.stringify(status);
    }
  };

  const localizationContext = React.useMemo(
    () => ({
      t: (key: string, options?: any) => tr(key, {locale, ...options}),
      supportedLocales: Object.keys(i18n.services.resourceStore.data),
      // setLocale: (loc: string) => updateLocale(loc),
      // syncRTL,
      toggleLocale,
      setToast: (t: Status) => {
        setToast({...t, message: getToastMessage(t)});
      },
      showToast: (t: Status) => {
        setToast({...t, message: getToastMessage(t)});
      },
      hideToast: () => {
        setToast(undefined);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  return (
    <LocalizationContext.Provider value={{locale, ...localizationContext}}>
      {children}
      {toast ? <Toaster {...toast} /> : null}
    </LocalizationContext.Provider>
  );
};

export {LocalizationContext, LocalizationProvider};

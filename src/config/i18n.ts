import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {locale} from './constants';

import en from '../locales/en/en.json';
import ar from '../locales/ar/ar.json';

const resources = {
  en: en,
  ar: ar,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: locale.DEFAULT_LANGUAGE,
    // ns: ['signInScreen'],
    fallbackLng: locale.FALLBACK_LANGUAGE,
    // debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

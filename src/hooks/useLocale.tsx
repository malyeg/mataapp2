import {useContext, useMemo} from 'react';
import {LocalizationContext} from '../contexts/LocalizationContext';

const NAMESPACE_SEPARATOR: string = ':';
type LocaleOptions = {
  defaultValue?: string;
  params?: {[key: string]: string};
};
const useLocale = (ns?: string) => {
  const {t, locale, supportedLocales, toggleLocale} =
    useContext(LocalizationContext);

  let keyPrefix = ns ? ns + NAMESPACE_SEPARATOR : '';

  const useLocaleResponse = useMemo(
    () => ({
      t: (key: string, options?: LocaleOptions) =>
        t(keyPrefix + key, {...options, ...options?.params}),
    }),
    [keyPrefix, t],
  );

  return {
    locale,
    supportedLocales,
    toggleLocale,
    ...useLocaleResponse,
  };
};

export default useLocale;

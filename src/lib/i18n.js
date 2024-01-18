import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation as useNativeTranslation } from 'react-i18next';

const DEFAULT_LOCALE = 'zh-TW';
export const LOCALE_KEY = 'locale';
const SUPPORTED_LOCALES = ['zh-TW', 'en'];

let locale = DEFAULT_LOCALE;

if (typeof window !== 'undefined') {
  const location = window.location;
  const urlSearch = new URLSearchParams(location.search);

  const localeValue = urlSearch.get(LOCALE_KEY);
  const decodedLocaleValue = decodeURIComponent(urlSearch.get(LOCALE_KEY));

  if (localeValue && SUPPORTED_LOCALES.includes(decodedLocaleValue)) {
    locale = decodedLocaleValue;
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: locale,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    load: 'currentOnly',
  });

export default i18n;

export const useTranslation = (...params) => {
  const { t } = useNativeTranslation(...params);

  return t;
};

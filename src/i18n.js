import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

// We configure language detection to look at path first, then localStorage, then navigator
// But since we are enforcing a purely URL-based routing (/:lang/*), 
// React Router will act as our primary source of truth, and this config primarily 
// ensures we have a fallback and cache.
const detectionOptions = {
  order: ['path', 'localStorage', 'navigator'],
  caches: ['localStorage'],
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      ar: { common: arCommon },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    detection: detectionOptions,
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

export default i18n;

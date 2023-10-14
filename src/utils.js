import i18n from 'i18next';
import resources from './locales/resources.js';

const i18nInstance = i18n.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources,
});

export default i18nInstance;

import i18nInstance from './utils.js';

const feedback = document.querySelector('.feedback');
const buttonSubmit = document.querySelector('button');
const appTitle = document.querySelector('h1');
const appLead = document.querySelector('p[class="lead"]');
const labelUrl = document.querySelector('label');
const exampleUrl = document.querySelector('p[class="mt-2"]');

const render = () => (path, value) => {
  switch (path) {
    case 'formRss.errors':
      feedback.innerHTML = value;
      break;
    case 'formRss.language':
      i18nInstance.changeLanguage(value).then(() => {
        buttonSubmit.textContent = i18nInstance.t('buttonSubmit');
        appTitle.textContent = i18nInstance.t('appTitle');
        appLead.textContent = i18nInstance.t('appLead');
        labelUrl.textContent = i18nInstance.t('labelUrl');
        exampleUrl.textContent = `${i18nInstance.t('exampleUrl')} https://ru.hexlet.io/lessons.rss`;
      });
      break;
    default:
      break;
  }
};

export default render;

import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import i18nInstance from './utils.js';
import render from './view.js';

export default () => {
  console.log('Hello World!');

  const initialState = {
    formRss: {
      valid: true,
      errors: '',
      url: '',
    },
    feeds: [],
    language: '',
  };

  const state = onChange(initialState, render());

  const schema = yup.string().required().url('incorrect url').notOneOf(state.feeds, 'Link already added');

  const buttonSubmit = document.querySelector('button[type="submit"]');
  const inputUrl = document.querySelector('#url-input');
  const formRss = document.querySelector('form');

  buttonSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const { value } = inputUrl;
    schema.validate(value)
      .then(() => {
        state.formRss.errors = '';
        state.formRss.valid = true;
        state.feeds.push(value);
        formRss.reset();
        inputUrl.focus();
        console.log(state.feeds);
      })
      .catch((err) => {
        console.log(err.message);
        const error = err.message;
        state.formRss.errors = i18nInstance.t(`errors.${error}`);
        // state.formRss.errors = i18nInstance.t(`${error}`);
        state.formRss.valid = false;
      });
  });

  state.language = 'ru';
};

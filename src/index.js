import './scss/styles.scss';
import 'bootstrap';

import * as yup from 'yup';
import onChange from 'on-change';
import render from './view.js';

console.log('Hello World!');

const initialState = {
  formRss: {
    valid: true,
    errors: '',
    url: '',
  },
  feeds: [],
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
      state.formRss.errors = error;
      state.formRss.valid = false;
    });
});

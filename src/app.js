import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import i18nInstance from './utils.js';
import { appRender, rssRender } from './view.js';

export default () => {
  console.log('Hello World!');

  const initialState = {
    formRss: {
      valid: true,
      errors: '',
      url: '',
      buttonSubmitDisable: false,
    },
    feeds: [],
    language: '',
  };

  const feedsState = {
    feedsTitles: [],
    feedsPosts: [],
    postsCounter: 0,
  };

  const feeds = onChange(feedsState, rssRender());
  const state = onChange(initialState, appRender());

  const makeParse = (data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/xml');
    const errorNode = doc.querySelector('parsererror');
    return errorNode ? 'error' : doc;
  };

  const makeRSS = (html, url) => {
    if (html !== 'error') {
      console.log(html);
      state.formRss.errors = 'noerror';
      state.formRss.valid = true;
      state.feeds.push(url);
      const feedId = _.uniqueId();
      const titleElement = html.querySelector('channel > title');
      const title = titleElement.textContent;
      const descriptionElement = html.querySelector('channel > description');
      const description = descriptionElement.textContent;
      feeds.feedsTitles.push({ feedId, title, description });
      console.log(feeds.feedsTitles);

      const items = [...html.querySelectorAll('item')];
      const posts = items.map((item) => {
        const postTitleElement = item.querySelector('title');
        const postTitle = postTitleElement.textContent;
        const postLinkElement = item.querySelector('link');
        const postLink = postLinkElement.textContent;
        feeds.postsCounter += 1;
        const postId = feeds.postsCounter;
        return {
          feedId, postTitle, postLink, postId,
        };
      });

      feeds.feedsPosts.push(...posts);
      console.log(feeds.feedsPosts);
    } else {
      state.formRss.errors = i18nInstance.t('errors.ParsingError');
    }
  };

  const schema = yup.string().required().url('incorrect url').notOneOf(state.feeds, 'Link already added');

  const makeRequest = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .catch(() => {
      state.formRss.errors = i18nInstance.t('errors.NetworkError');
      throw Error('Networkerror');
    });

  const buttonSubmit = document.querySelector('button[type="submit"]');
  const inputUrl = document.querySelector('#url-input');
  const formRss = document.querySelector('form');

  buttonSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    state.formRss.buttonSubmitDisable = true;
    const { value } = inputUrl;

    schema.validate(value)
      .then(() => makeRequest(value))
      .then((response) => {
        console.log(response.data.contents);
        const html = makeParse(response.data.contents);
        makeRSS(html, value);
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
        state.formRss.buttonSubmitDisable = false;
      });
  });

  state.language = 'ru';
};

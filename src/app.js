/* eslint-disable max-len */
import * as yup from 'yup';
import _ from 'lodash'; //
import axios from 'axios';
import i18next from 'i18next';
import watcher from './view.js';
import parser from './parser.js';
import resources from './locales/resources.js';

export default () => {
  const initialState = {
    feeds: [], // Массив лент (объекты с информацией о лентах)
    posts: [], // Массив постов (объекты с информацией о постах)
    formRss: {
      error: null, // Ошибка формы, если есть
      valid: false, // Валидность формы (по умолчанию невалидна)
    },
    language: '',
    modalPost: null, // Идентификатор отображаемого модального поста (по умолчанию null)
    viewPosts: [], // Массив идентификаторов просматриваемых постов
    connectionMode: 'detach', // Состояние загрузки (по умолчанию 'ok')
  };

  const elements = {
    formRss: document.querySelector('.rss-form'),
    inputUrl: document.querySelector('#url-input'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };

  const i18n = i18next.createInstance();

  const watchedState = watcher(initialState, elements, i18n);

  i18n
    .init({
      debug: true,
      lng: 'ru',
      resources,
    })
    .then(() => {
      yup.setLocale({
        string: {
          url: () => ({ key: 'errors.IncorrectUrl', validationError: true }),
        },
        mixed: {
          required: () => ({ key: 'errros.Required', validationError: true }),
          notOneOf: () => ({ key: 'errors.LinkAlreadyAdded', validationError: true }),
        },
      });

      const validateUrl = (url, feeds) => {
        const schema = yup.string().required().url().notOneOf(feeds);

        return schema.validate(url);
      };

      const errorHandler = (error) => {
        if (error.message.validationError) {
          console.log(error.message);
          watchedState.formRss = {
            valid: false,
            error,
          };
        } else if (error.message.parsingError) {
          watchedState.formRss = {
            valid: false,
            error,
          };
        }
      };

      const getProxyUrl = (url) => {
        const href = new URL('/get', 'https://allorigins.hexlet.app');
        href.searchParams.set('url', url);
        href.searchParams.set('disableCache', 'true');
        return href;
      };

      const refreshPosts = () => {
        const handleRefresh = () => {
          const promises = initialState.feeds.map((feed) => {
            const feedUrl = feed.url;
            return axios
              .get(getProxyUrl(feedUrl))
              .then((response) => {
                const rssData = response.data.contents;
                const parsingResults = parser(rssData);
                const { rssNodeTitle, rssNodeDescription, posts } = parsingResults;
                // const { rssNodeTitle, posts } = parsingResults;

                const newPosts = _.differenceWith(posts, initialState.posts, (a, b) => a.title === b.title);
                const updatedPosts = newPosts.map((post) => {
                  post.id = _.uniqueId();
                  post.feedId = feed.id;
                  return post;
                });
                initialState.posts.unshift(...updatedPosts);
                console.log(`rssNodeTitle: ${rssNodeTitle}`);
              })
              .catch((error) => {
                console.error(error);
              });
          });

          return Promise.all(promises);
        };

        setTimeout(handleRefresh, 5000);
      };

      refreshPosts(initialState);

      elements.formRss.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const existingLinks = initialState.feeds.map((feed) => feed.url);

        validateUrl(url, existingLinks)
          .then(() => {
            watchedState.connectionMode = 'load';
            watchedState.formRss.valid = true;
            return axios.get(getProxyUrl(url));
          })
          .then((response) => {
            const rssData = response.data.contents;
            const parsingResults = parser(rssData);
            // console.log(`parsingResults: ${parsingResults}`);
            const { rssNodeTitle, rssNodeDescription, posts } = parsingResults;
            // console.log(`posts: ${posts}`);
            const feed = {
              url,
              id: _.uniqueId(),
              title: rssNodeTitle,
              description: rssNodeDescription,
            };

            const post = posts.map((item) => ({
              ...item,
              feedId: feed.id,
              id: _.uniqueId(),
            }));

            watchedState.feeds.unshift(feed);
            watchedState.posts.unshift(...post);

            watchedState.connectionMode = 'detach';
            watchedState.formRss = { error: null, valid: true };
          })
          .catch((error) => {
            errorHandler(error);
          });
      });
    });
};

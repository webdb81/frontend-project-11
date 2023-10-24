import * as yup from 'yup';
import _ from 'lodash'; //
import axios from 'axios';
import i18next from 'i18next';
import watcher from './view.js';
import parser from './parser.js';
import resources from './locales/resources.js';

export default () => {
  const initialState = {
    feeds: [],
    posts: [],
    formRss: {
      error: null,
      valid: false,
    },
    modalPost: null,
    viewPosts: [],
    connectionMode: {
      status: 'standby',
      error: null,
    },
  };

  const elements = {
    formRss: document.querySelector('.rss-form'),
    inputUrl: document.querySelector('#url-input'),
    buttonSubmit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modalPostTitle: document.querySelector('.modal-title'),
    modalPostText: document.querySelector('.modal-body'),
    modalPostLink: document.querySelector('.full-article'),
  };

  const i18n = i18next.createInstance();

  i18n
    .init({
      debug: true,
      lng: 'ru',
      resources,
    })
    .then(() => {
      yup.setLocale({
        string: {
          url: { key: 'errors.incorrectUrl', validationError: true },
        },
        mixed: {
          required: () => ({ key: 'errros.requiredField', validationError: true }),
          notOneOf: () => ({
            key: 'errors.rssAlreadyAdded',
            validationError: true,
          }),
        },
      });

      const validateUrl = (url, rssAlreadyAdded) => {
        const schema = yup.string().required().url().notOneOf(rssAlreadyAdded);

        return schema.validate(url);
      };

      const watchedState = watcher(initialState, elements, i18n);

      const errorHandler = (error) => {
        if (error.message.validationError) {
          console.log(error.message);
          watchedState.formRss = {
            valid: false,
            error: error.message.key,
          };
        } else if (error.isparsingError) {
          watchedState.connectionMode = {
            status: 'failed',
            error: 'errors.parsingError',
          };
        } else if (error.isAxiosError) {
          watchedState.connectionMode = {
            status: 'failed',
            error: 'errors.networkError',
          };
        } else {
          watchedState.connectionMode = {
            status: 'failed',
            error: 'errors.servicingError',
          };
        }
      };

      const getProxyUrl = (url) => {
        const href = new URL('/get', 'https://allorigins.hexlet.app');
        href.searchParams.set('url', url);
        href.searchParams.set('disableCache', 'true');
        return href;
      };

      const refreshPostsInterval = 5000;
      const refreshPosts = () => {
        const promises = initialState.feeds.map((feed) => {
          const feedUrl = feed.url;
          return axios
            .get(getProxyUrl(feedUrl))
            .then((response) => {
              const rssData = response.data.contents;
              const parsingResults = parser(rssData);
              const { posts } = parsingResults;

              const newPosts = _.differenceWith(
                posts,
                initialState.posts,
                (a, b) => a.title === b.title,
              );
              const updatedPosts = newPosts.map((post) => {
                const updatedPost = { ...post };
                updatedPost.id = _.uniqueId();
                updatedPost.feedId = feed.id;
                return updatedPost;
              });
              initialState.posts.unshift(...updatedPosts);
            })
            .catch((error) => {
              console.error(error);
            });
        });

        Promise.all(promises).finally(() => {
          setTimeout(() => refreshPosts(), refreshPostsInterval);
        });
      };

      refreshPosts(initialState);

      elements.formRss.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const existingLinks = initialState.feeds.map((feed) => feed.url);

        validateUrl(url, existingLinks)
          .then(() => {
            watchedState.connectionMode = { status: 'load', error: null };
            watchedState.formRss = { valid: true, error: null };
            return axios.get(getProxyUrl(url));
          })
          .then((response) => {
            const rssData = response.data.contents;
            const parsingResults = parser(rssData);
            const { rssNodeTitle, rssNodeDescription, posts } = parsingResults;
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

            watchedState.connectionMode = { status: 'standby', error: null };
            watchedState.formRss = { error: null, valid: true };
          })
          .catch((error) => {
            errorHandler(error);
          });
      });

      elements.postsContainer.addEventListener('click', (e) => {
        const { target } = e;
        const id = target.getAttribute('data-id');
        if (id) {
          watchedState.modalPost = id;
          watchedState.viewPosts.push(id);
        }
      });
    });
};

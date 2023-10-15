/* eslint-disable import/prefer-default-export */
import i18nInstance from './utils.js';

const feedback = document.querySelector('.feedback');
const buttonSubmit = document.querySelector('button');
const appTitle = document.querySelector('h1');
const appLead = document.querySelector('p[class="lead"]');
const labelUrl = document.querySelector('label');
// const exampleUrl = document.querySelector('p[class="mt-2"]');
const exampleUrl = document.querySelector('.example');

export const appRender = () => (path, value) => {
  switch (path) {
    case 'formRss.errors':
      if (value === 'noerror') {
        feedback.classList.replace('text-danger', 'text-success');
      } else if (value !== 'noerror' && feedback.classList.contains('text-success')) {
        feedback.classList.replace('text-success', 'text-danger');
      }
      feedback.innerHTML = value !== 'noerror' ? value : i18nInstance.t('successLoad');
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
    case 'formRss.buttonSubmitDisable':
      buttonSubmit.disabled = value;
      break;
    default:
      break;
  }
};

const createFeeds = (feedValue) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';

  const feedsWrap = document.createElement('div');
  feedsWrap.classList.add('card', 'border-0');

  const feedsBody = document.createElement('div');
  feedsBody.classList.add('card-body');

  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18nInstance.t('feedsTitle');

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  feedsBody.append(feedsTitle);
  feedsWrap.append(feedsBody, feedsList);

  feedValue.forEach((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedItemTitle = document.createElement('h3');
    feedItemTitle.classList.add('h6', 'm-0');
    feedItemTitle.textContent = feed.title;

    const feedItemText = document.createElement('p');
    feedItemText.classList.add('m-0', 'small', 'text-black-50');
    feedItemText.textContent = feed.description;

    feedItem.append(feedItemTitle, feedItemText);
    feedsList.prepend(feedItem);
  });

  feedsContainer.append(feedsWrap);
};

const createPosts = (postValue) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';

  const postsWrap = document.createElement('div');
  postsWrap.classList.add('card', 'border-0');

  const postsBody = document.createElement('div');
  postsBody.classList.add('card-body');

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = i18nInstance.t('postsTitle');

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  postsBody.append(postsTitle);
  postsWrap.append(postsBody, postsList);
  postsContainer.append(postsWrap);

  postValue.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const postItemLink = document.createElement('a');
    postItemLink.classList.add('fw-bold');
    postItemLink.setAttribute('href', `${post.postLink}`);
    postItemLink.setAttribute('data-id', `${post.postId}`);
    postItemLink.setAttribute('target', '_blank');
    postItemLink.setAttribute('rel', 'noopener noreferrer');
    postItemLink.textContent = post.postTitle;

    const modalOpen = document.createElement('button');
    modalOpen.setAttribute('type', 'button');
    modalOpen.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    modalOpen.dataset.id = `${post.postId}`;
    modalOpen.dataset.bsToogle = 'modal';
    modalOpen.dataset.bsTarget = '#modal';
    modalOpen.textContent = i18nInstance.t('modalOpen');

    postItem.append(postItemLink, modalOpen);
    postsList.prepend(postItem);
  });
};

export const rssRender = () => (path, value) => {
  switch (path) {
    case 'feedsTitles':
      createFeeds(value);
      break;
    case 'feedsPosts':
      createPosts(value);
      break;
    default:
      break;
  }
};

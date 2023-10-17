/* eslint-disable default-case */
import onChange from 'on-change';

const handlingForm = (initialState, elements, i18n) => {
  const updateElements = { ...elements };

  if (initialState.formRss.error) {
    updateElements.feedback.classList.add('text-danger');
    updateElements.feedback.classList.remove('text-success');
    updateElements.feedback.textContent = i18n.t(initialState.formRss.error);
  }
  if (initialState.formRss.valid) {
    updateElements.inputUrl.classList.remove('is-invalid');
  } else {
    updateElements.inputUrl.classList.add('is-invalid');
  }
  return updateElements;
};

const handlingFeeds = (initialState, elements) => {
  console.log('Feeds:', initialState.feeds);
  console.log('Posts:', initialState.posts);
  elements.feedsContainer.innerHTML = '';
  const feedsWrap = document.createElement('div');
  feedsWrap.classList.add('card', 'border-0');

  const feedsBody = document.createElement('div');
  feedsBody.classList.add('card-body');
  feedsWrap.append(feedsBody);

  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = 'Фиды';
  feedsBody.append(feedsTitle);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');
  feedsWrap.append(feedsList);

  initialState.feeds.forEach((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedsList.append(feedItem);

    const feedItemTitle = document.createElement('h3');
    feedItemTitle.classList.add('h6', 'm-0');
    feedItemTitle.textContent = feed.title;

    const feedItemText = document.createElement('p');
    feedItemText.classList.add('m-0', 'small', 'text-black-50');
    feedItemText.textContent = feed.description;
    feedItem.append(feedItemTitle, feedItemText);
  });

  elements.feedsContainer.append(feedsWrap);
};

const handlingPosts = (initialState, elements) => {
  //  console.log('Feeds:', initialState.feeds);
  // console.log('Posts:', initialState.posts);
  elements.postsContainer.innerHTML = '';

  const postsWrap = document.createElement('div');
  postsWrap.classList.add('card', 'border-0');

  const postsBody = document.createElement('div');
  postsBody.classList.add('card-body');
  postsWrap.append(postsBody);

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = 'Посты';
  postsBody.append(postsTitle);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  postsWrap.append(postsList);

  initialState.posts.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const postItemLink = document.createElement('a');
    postItemLink.textContent = post.title;
    postItemLink.setAttribute('href', post.link);
    postItemLink.setAttribute('data-id', post.id);
    postItemLink.setAttribute('target', '_blank');

    if (initialState.viewPosts.includes(post.postId)) {
      postItemLink.classList.add('fw-normal', 'link-secondary');
    } else {
      postItemLink.classList.add('fw-blod');
    }

    const modalOpen = document.createElement('button');
    modalOpen.type = 'button';
    modalOpen.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    modalOpen.setAttribute('data-id', post.postId);
    modalOpen.setAttribute('data-bs-toggle', 'modal');
    modalOpen.setAttribute('data-bs-target', '#modal');
    modalOpen.textContent = 'Просмотр';

    postItem.append(postItemLink, modalOpen);
    postsList.append(postItem);
  });

  elements.postsContainer.append(postsWrap);
};

export default (initialState, elements, i18n) => {
  const watchedState = onChange(initialState, (path) => {
    switch (path) {
      case 'formRss': {
        handlingForm(initialState, elements, i18n);
        break;
      }
      case 'feeds': {
        handlingFeeds(initialState, elements, i18n);
        break;
      }
      case 'posts': {
        handlingPosts(initialState, elements, i18n);
        break;
      }
      case 'viewPosts': {
        handlingPosts(initialState, elements, i18n);
        break;
      }
    }
  });

  return watchedState;
};

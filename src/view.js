import onChange from 'on-change';

const handlingForm = (initialState, elements, i18n) => {
  const currentElements = { ...elements };

  if (initialState.formRss.error) {
    currentElements.feedback.classList.add('text-danger');
    currentElements.feedback.classList.remove('text-success');
    currentElements.feedback.textContent = i18n.t(initialState.formRss.error);
  }
  if (initialState.formRss.valid) {
    currentElements.inputUrl.classList.remove('is-invalid');
  } else {
    currentElements.inputUrl.classList.add('is-invalid');
  }

  return currentElements;
};

const handlingFeeds = (initialState, elements, i18n) => {
  // console.log('Feeds:', initialState.feeds);
  // console.log('Posts:', initialState.posts);
  const currentElements = { ...elements };

  currentElements.feedsContainer.textContent = '';
  const feedsWrap = document.createElement('div');
  feedsWrap.classList.add('card', 'border-0');

  const feedsBody = document.createElement('div');
  feedsBody.classList.add('card-body');
  feedsWrap.append(feedsBody);

  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18n.t('feedsTitle');
  feedsBody.append(feedsTitle);

  const feedsList = document.createElement('ul');
  feedsList.classList.add(
    'list-group',
    'border-0',
    'rounded-0',
  );
  feedsWrap.append(feedsList);

  initialState.feeds.forEach((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add(
      'list-group-item',
      'border-0',
      'border-end-0',
    );
    feedsList.append(feedItem);

    const feedItemTitle = document.createElement('h3');
    feedItemTitle.classList.add('h6', 'm-0');
    feedItemTitle.textContent = feed.title;

    const feedItemText = document.createElement('p');
    feedItemText.classList.add(
      'm-0',
      'small',
      'text-black-50',
    );
    feedItemText.textContent = feed.description;
    feedItem.append(feedItemTitle, feedItemText);
  });
  currentElements.feedsContainer.append(feedsWrap);

  return currentElements;
};

const handlingPosts = (initialState, elements, i18n) => {
  //  console.log('Feeds:', initialState.feeds);
  // console.log('Posts:', initialState.posts);
  const currentElements = { ...elements };

  currentElements.postsContainer.textContent = '';

  const postsWrap = document.createElement('div');
  postsWrap.classList.add('card', 'border-0');

  const postsBody = document.createElement('div');
  postsBody.classList.add('card-body');
  postsWrap.append(postsBody);

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = i18n.t('postsTitle');
  postsBody.append(postsTitle);

  const postsList = document.createElement('ul');
  postsList.classList.add(
    'list-group',
    'border-0',
    'rounded-0',
  );
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
    postItemLink.setAttribute('id', post.id);
    postItemLink.setAttribute('target', '_blank');

    if (initialState.viewPosts.includes(post.id)) {
      postItemLink.classList.add('fw-normal', 'link-secondary');
    } else {
      postItemLink.classList.add('fw-bold');
    }

    const modalOpen = document.createElement('button');
    modalOpen.type = 'button';
    modalOpen.classList.add(
      'btn',
      'btn-outline-primary',
      'btn-sm',
    );
    modalOpen.setAttribute('data-id', post.id);
    modalOpen.setAttribute('data-bs-toggle', 'modal');
    modalOpen.setAttribute('data-bs-target', '#modal');
    modalOpen.textContent = i18n.t('modalOpen');

    postItem.append(postItemLink, modalOpen);
    postsList.append(postItem);
  });
  currentElements.postsContainer.append(postsWrap);

  return currentElements;
};

const handlingModal = (initialState, elements) => {
  const currentElements = { ...elements };

  const postModalPreview = initialState.posts
    .find((post) => post.id === initialState.modalPost);

  currentElements.modalPostLink.setAttribute('href', postModalPreview.link);
  currentElements.modalPostTitle.textContent = postModalPreview.title;
  currentElements.modalPostText.textContent = postModalPreview.description;

  return currentElements;
};

const handlingConnection = (initialState, elements, i18n) => {
  const currentElements = { ...elements };

  if (initialState.connectionMode.error) {
    currentElements.feedback.classList.remove('text-success');
    currentElements.feedback.classList.add('text-danger');
    currentElements.feedback.textContent = i18n.t(initialState.connectionMode.error);
  }
  switch (initialState.connectionMode.status) {
    case 'standby': {
      currentElements.inputUrl.value = '';
      currentElements.feedback.classList.remove('text-danger');
      currentElements.feedback.classList.add('text-success');
      currentElements.feedback.textContent = i18n.t('successLoad');
      currentElements.inputUrl.classList.remove('is-invalid');
      currentElements.inputUrl.disabled = false;
      currentElements.buttonSubmit.disabled = false;
      break;
    }
    case 'load': {
      currentElements.inputUrl.disabled = true;
      currentElements.buttonSubmit.disabled = true;
      break;
    }
    case 'failed': {
      currentElements.inputUrl.classList.add('is-invalid');
      currentElements.inputUrl.disabled = false;
      currentElements.buttonSubmit.disabled = false;
      break;
    }
    default:
      break;
  }
  return currentElements;
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
      case 'modalPost': {
        handlingModal(initialState, elements);
        break;
      }
      case 'connectionMode': {
        handlingConnection(initialState, elements, i18n);
        break;
      }
      default:
        throw new Error('Something went wrong');
    }
  });

  return watchedState;
};

const feedback = document.querySelector('.feedback');

const render = () => (path, value) => {
  switch (path) {
    case 'formRss.errors':
      feedback.innerHTML = value;
      break;
    default:
      break;
  }
};

export default render;

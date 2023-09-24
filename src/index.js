import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  'live_tUjJzgnldWMq1j0KXqo8xUPfkU0ZEQgWIOx6oI8Z4MApDV9Hp7RkOUWgC3xsOPtr';

import SlimSelect from 'slim-select';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import selectTpl from './templates/select.hbs';
import getRefs from './get-refs';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const refs = getRefs();
const errorMessage = 'Oops! Something went wrong! Try reloading the page!';

refs.error.classList.add('is-hidden');
refs.select.classList.add('is-hidden');

fetchBreeds()
  .then(data => {
    const selectMarkup = selectTpl(data);
    refs.select.innerHTML = selectMarkup;
    refs.loader.classList.add('is-hidden');
    refs.select.classList.remove('is-hidden');
    new SlimSelect({
      select: refs.select,
    });
  })
  .catch(() => errorShow(errorMessage, 100000));

refs.select.addEventListener('change', onSelectChange);

function onSelectChange(e) {
  refs.catInfo.innerHTML = '';
  refs.loader.classList.remove('is-hidden');

  fetchCatByBreed(e.target.value)
    .then(data => {
      const catInfoMarkup = catMarkup(data);
      refs.loader.classList.add('is-hidden');
      refs.catInfo.innerHTML = catInfoMarkup;
    })
    .catch(() => errorShow(errorMessage));
}

function errorShow(message, timeout = 10000) {
  refs.loader.classList.add('is-hidden');
  refs.error.classList.remove('is-hidden');
  refs.error.textContent = notifyError(message, timeout);
}

function notifyError(message, timeout) {
  Notify.failure(message, {
    timeout: timeout,
    showOnlyTheLastOne: true,
    position: 'center-center',
  });
}

function catMarkup(data) {
  return `<img src="${data.url}" alt="${data.breeds[0].name}" >
          <div>
            <h2>${data.breeds[0].name}</h2>
            <p>${data.breeds[0].description}</p>
            <p>
              <span>Temperament:</span>
              ${data.breeds[0].temperament}
            </p>
          </div>`;
}

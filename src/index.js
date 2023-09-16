import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  'live_tUjJzgnldWMq1j0KXqo8xUPfkU0ZEQgWIOx6oI8Z4MApDV9Hp7RkOUWgC3xsOPtr';

import SlimSelect from 'slim-select';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import selectTpl from './templates/select.hbs';
import getRefs from './get-refs';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const refs = getRefs();

// new SlimSelect({
//   select: refs.select
// })
refs.error.style.display = 'none';
refs.select.style.display = 'none';

fetchBreeds()
  .then(data => {
    const selectMarkup = selectTpl(data);
    refs.select.innerHTML = selectMarkup;
    refs.loader.style.display = 'none';
    refs.select.style.display = 'inline-block';
  })
  .catch(() => {
    // refs.select.style.display = 'none';
    refs.loader.style.display = 'none';
    // refs.error.style.display = 'block';
    notifyError();
  });

refs.select.addEventListener('change', onSelectChange);

function onSelectChange(e) {
  refs.catInfo.innerHTML = '';
  refs.loader.style.display = 'block';

  fetchCatByBreed(e.target.value)
    .then(data => {
      const catInfoMarkup = catsMarkup(data);
      refs.loader.style.display = 'none';
      refs.catInfo.innerHTML = catInfoMarkup;
    })
    .catch(() => {
      notifyError();
      refs.loader.style.display = 'none';
      refs.error.style.display = 'block';
    });
}

function notifyError(
  message = 'Oops! Something went wrong! Try reloading the page!'
) {
  Notify.failure(message, {
    timeout: 10000,
    showOnlyTheLastOne: true,
    position: 'center-center',
  });
}

function catsMarkup(data) {
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

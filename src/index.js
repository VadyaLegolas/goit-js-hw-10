import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  'live_tUjJzgnldWMq1j0KXqo8xUPfkU0ZEQgWIOx6oI8Z4MApDV9Hp7RkOUWgC3xsOPtr';

import SlimSelect from 'slim-select';

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
    refs.loader.style.display = 'none';
    refs.select.style.display = 'inline-block';
    const selectMarkup = selectTpl(data);
    refs.select.insertAdjacentHTML('beforeend', selectMarkup);
  })
  .catch(error => {
    console.log('error');
    refs.select.style.display = 'none';
    refs.error.style.display = 'block';
  });

refs.select.addEventListener('change', onSelectChange);

function onSelectChange(e) {
  refs.catInfo.innerHTML = '';
  refs.loader.style.display = 'block';
  fetchCatByBreed(e.target.value)
    .then(data => {
      const catInfoMarkup = `<img src="${data.url}" alt="${data.breeds[0].name}" >
      <div>
        <h2>${data.breeds[0].name}</h2>
        <p>${data.breeds[0].description}</p>
        <p>
          <span>Temperament:</span>
          ${data.breeds[0].temperament}
        </p>
      </div>`;
      refs.loader.style.display = 'none';
      refs.catInfo.innerHTML = catInfoMarkup;
    })
    .catch(() => {
      refs.loader.style.display = 'none';
      refs.error.style.display = 'block';
    });
}

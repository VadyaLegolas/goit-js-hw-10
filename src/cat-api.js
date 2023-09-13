const BASE_URL = 'https://api.thecatapi.com/v1';

function fetchBreeds() {
  return fetch(`${BASE_URL}/breeds`).then(response => response.json());
}

function fetchCatByBreed(breedId) {
  return fetch(`${BASE_URL}/images/search?breed_ids=${breedId}`)
    .then(response => response.json())
    .then(data =>
      fetch(`${BASE_URL}/images/${data[0].id}`).then(res => res.json())
    );
}

export { fetchBreeds, fetchCatByBreed };

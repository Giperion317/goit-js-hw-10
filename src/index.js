import './css/styles.css';

import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryBox = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}

function onSearchInput(event) {
  event.preventDefault();
  let nameSearchCountry = event.target.value.trim();
  if (nameSearchCountry === '') {
    return;
  }
  fetchCountries(nameSearchCountry)
    .then(data => {
      if (data.length > 10) {
        countryBox.innerHTML = '';
        list.innerHTML = '';
        console.log(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length >= 2) {
        countriesListCreate(data);
        countryBox.innerHTML = '';
      }
      if (data.length === 1) {
        countryCreate(data);
        list.innerHTML = '';
      }
    })
    .catch(error => {
      console.log('Oops, there is no country with that name');
    });
}

function countriesListCreate(data) {
  const markup = data
    .map(
      country => `<li>
  <img src="${country.flags.svg}" alt="Coutry Flag" width="40" />
  <p>${country.name.official}</p>
</li>`
    )
    .join('');
  list.innerHTML = markup;
}

function countryCreate(data) {
  const markup = data
    .map(
      country => `<img src="${
        country.flags.svg
      }" alt="Coutry Flag" width="40" />
  <p>${country.name.official}</p>
  <p class="countri-data">Capital:<span>${country.capital}</span></p>
  <p class="countri-data">Population:<span>${country.population}</span></p>
  <p class="countri-data">Languages:<span>${Object.values(
    country.languages
  )}</span></p>`
    )
    .join('');
  countryBox.innerHTML = markup;
}

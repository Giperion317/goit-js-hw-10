import './css/styles.css';

import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '300px',
  position: 'center-top',
  distance: '10px',
  borderRadius: '10px',
  timeout: 1000,
});

import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryBox = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(event) {
  event.preventDefault();
  let nameSearchCountry = event.target.value.trim();
  if (nameSearchCountry === '') {
    clearMarkup();
    return;
  }
  fetchCountries(nameSearchCountry)
    .then(data => {
      createMarkup(data);
    })
    .catch(error => {
      clearMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkup(data) {
  if (data.length > 10) {
    clearMarkup();
    Notify.info('Too many matches found. Please enter a more specific name.');

    return;
  }
  if (data.length >= 2) {
    createCountriesList(data);
    countryBox.innerHTML = '';
  }
  if (data.length === 1) {
    createCountry(data);
    list.innerHTML = '';
  }
}

function createCountriesList(data) {
  const markup = data
    .map(
      country => `<li class = "coutry-item">
  <img src="${country.flags.svg}" alt="Coutry Flag" width="40" />
  <p class = "coutry-name">${country.name.common}</p>
</li>`
    )
    .join('');
  list.innerHTML = markup;
}

function createCountry(data) {
  const markup = data
    .map(
      country => `<div class="country-info-wraperr"><img src="${
        country.flags.svg
      }" alt="Coutry Flag" width="40" />
  <p class = "coutry-info-name">${country.name.common}</p></div>
  <p class="country-info-data">Capital:<span class="country-info-item">${
    country.capital
  }</span></p>
  <p class="country-info-data">Population:<span class="country-info-item">${
    country.population
  }</span></p>
  <p class="country-info-data">Languages:<span class="country-info-item">${Object.values(
    country.languages
  )}</span></p>`
    )
    .join('');
  countryBox.innerHTML = markup;
}

function clearMarkup() {
  countryBox.innerHTML = '';
  list.innerHTML = '';
}

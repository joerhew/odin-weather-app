import getWeather, { search } from './weatherapi.js'

//Default values
const DEFAULT_CITY = 'Toronto'
//Select elements
const CONTAINER_SEARCH = document.querySelector('#search');
const CONTAINER_CURRENT = document.querySelector('#current');
const CONTAINER_FORECAST = document.querySelector('#forecast');
const HEADER = document.querySelector('#page-header');
const INPUT_CITY = document.querySelector('#city');
//Text strings
const HEADER_TEXT = 'Weather in'

export default function init() {
  getWeather(DEFAULT_CITY)
    .then(data => {
      renderPage(data);
    });
  addListenerToButton();
}

function renderPage(data) {
  renderHeader(data);
  renderCurrentWeather(data);
  renderForecast(data);
}

function renderHeader(data) {
  console.log(data.name);
  console.log(data.country);
  HEADER.textContent = `${HEADER_TEXT} ${data.name}, ${data.country}`
}

function renderCurrentWeather(data) {
  console.log(data.current)
  CONTAINER_CURRENT.textContent = data.current.feelslike_c;
}

function renderForecast(data) {
  console.log(data.forecast)
  CONTAINER_FORECAST.textContent = data.forecast[1].date;
}

function addListenerToButton() {
  const submitButton = document.querySelector('#enter-city');

  submitButton.addEventListener('click', e => {
    e.preventDefault();
    clarify(INPUT_CITY.value);
    getWeather(INPUT_CITY.value)
    .then(data => {
      renderPage(data);
    });
  })
}

async function clarify(city) {
  let cities = await search(city);
  if (cities.length > 1) { //More than one possible city in search results
    cities.forEach(city => {
      let cityOptionDiv = document.createElement('div');
      let cityOptionText = document.createElement('p');
      
      cityOptionDiv.classList.add('city-option');
      cityOptionText.textContent = `${city.name}, ${city.region}, ${city.country}`;

      CONTAINER_SEARCH.appendChild(cityOptionDiv);
      cityOptionDiv.appendChild(cityOptionText);
    });
  } else if (cities.length === 0) { //No cities in search result
    console.log('No cities found');
  }
}
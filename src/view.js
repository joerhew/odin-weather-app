import getWeather from './weatherapi.js'

//Default values
const DEFAULT_CITY = 'Toronto'
//Select elements
const CONTAINER_CURRENT = document.querySelector('#current');
const CONTAINER_FORECAST = document.querySelector('#forecast');
const HEADER = document.querySelector('#page-header');
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
  let newCity = document.querySelector('#city');

  submitButton.addEventListener('click', e => {
    e.preventDefault();
    getWeather(newCity.value)
    .then(data => {
      renderPage(data);
    });
  })
}
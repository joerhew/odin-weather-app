import getWeather, { search } from './weatherapi.js';
import { utcToZonedTime, format } from 'date-fns-tz';

//Default values
const DEFAULT_CITY = 'Toronto'
//Select elements
const CONTAINER_SEARCH = document.querySelector('#search');
const CONTAINER_CURRENT = document.querySelector('#current');
const CONTAINER_FORECAST = document.querySelector('#forecast');
const HEADER = document.querySelector('#page-header');
const INPUT_CITY = document.querySelector('#city');
const BTN_SUBMIT = document.querySelector('#enter-city');
//Text strings
const HEADER_TEXT = 'Weather in'
const ERROR_INPUT_BLANK = 'Please enter a city name.'
const ERROR_INPUT_UNRECOGNIZED = `Sorry, we didn't recognize the city name. Please try again.`

export default function init() {
  getWeather(DEFAULT_CITY)
    .then(data => {
      renderPage(data);
    })
    .catch(error => {
      renderError(error);
    });
  addListenerToButton();
}

function createHtmlElement(elementType, innerText, classes, parentNode) {
  let newElement = document.createElement(elementType);
  for (let name of classes) {
    newElement.classList.add(name);
  }
  if (innerText) {
    newElement.innerText = innerText
  };
  parentNode.appendChild(newElement);

  return newElement;
}

function renderPage(data) {
  renderHeader(data);

  if (data) {
    renderCurrentWeather(data);
    renderForecast(data);
  }
}

function renderError() {
  CONTAINER_CURRENT.innerHTML = ''
  createHtmlElement('div', ERROR_INPUT_UNRECOGNIZED, ['error'], CONTAINER_CURRENT);
  HEADER.textContent = 'The Weather App';
}

function renderHeader(data) {
  HEADER.textContent = `${HEADER_TEXT} ${data.name}, ${data.country}`;
}

function renderCurrentWeather(data) {
  console.log(data.current)
  
  //Current condition text and icon
  let currentConditionDiv = createHtmlElement('div', '', ['current-condition'], CONTAINER_CURRENT);

  createHtmlElement('div', 'Current', ['current-text'], currentConditionDiv);
  
  let currentConditionIcon = document.createElement('img');
  currentConditionIcon.src = data.current.condition.icon
  currentConditionDiv.appendChild(currentConditionIcon);

  createHtmlElement('div', data.current.condition.text, [], currentConditionDiv);
  createHtmlElement('div', `${data.current.temp_c} °C`, ['current-temp'], currentConditionDiv);
  
  //Current condition - other info
  let currentMiscDiv = createHtmlElement('div', '', ['current-other'], CONTAINER_CURRENT);

  createHtmlElement('div', `Feels like: ${data.current.feelslike_c} °C`, ['current-feels-like'], currentMiscDiv);
  createHtmlElement('div', `Wind speed: ${data.current.wind_kph} kph`, ['current-wind'], currentMiscDiv);
  createHtmlElement('div', `Humidity: ${data.current.humidity}%`, ['current-humidity'], currentMiscDiv);
  createHtmlElement('div', `Precipitation: ${data.current.precip_mm} mm`, ['current-precip'], currentMiscDiv);
}

function formatDate(date) {
  const utcDate = utcToZonedTime(date, 'Etc/UTC');
  return format(utcDate, 'MMM d, Y', { timezone: 'Etc/UTC'});
}

function renderForecast(data) {
  console.log(data.forecast)
  data.forecast.forEach(forecastDay => {
    console.log(Date.parse(forecastDay.date));
    let formattedDate =  formatDate(forecastDay.date);
    
    let forecastDayDiv = createHtmlElement('div', '', ['forecast-day'], CONTAINER_FORECAST);

    createHtmlElement('div', formattedDate, ['forecast-day-date'], forecastDayDiv);

    let forecastConditionIcon = document.createElement('img');
    forecastConditionIcon.src = forecastDay.day.condition.icon
    forecastDayDiv.appendChild(forecastConditionIcon);

    createHtmlElement('div', forecastDay.day.condition.text, ['forecast-day-condition'], forecastDayDiv);
    createHtmlElement('div', `${forecastDay.day.avgtemp_c} °C`, ['forecast-day-condition'], forecastDayDiv);

    createHtmlElement('div', `High: ${forecastDay.day.maxtemp_c} °C`, ['forecast-day-other'], forecastDayDiv);
    createHtmlElement('div', `Low: ${forecastDay.day.mintemp_c} °C`, ['forecast-day-other'], forecastDayDiv);
    
    createHtmlElement('div', `Rain: ${forecastDay.day.daily_chance_of_rain || '0'}%`, ['forecast-day-other'], forecastDayDiv);
    if (forecastDay.day.daily_chance_of_rain) {
      createHtmlElement('div', `Precip: ${forecastDay.day.totalprecip_mm} mm`, ['forecast-day-other'], forecastDayDiv);
    }

    createHtmlElement('div', `Snow: ${forecastDay.day.daily_chance_of_snow || '0'}%`, ['forecast-day-other'], forecastDayDiv);
    if (forecastDay.day.daily_chance_of_snow) {
      createHtmlElement('div', `Precip: ${forecastDay.day.totalsnow_cm} cm`, ['forecast-day-other'], forecastDayDiv);
    }

  })
}

function addListenerToButton() {
  BTN_SUBMIT.addEventListener('click', e => {
    e.preventDefault();

    let previousErrorMsg = document.querySelector('.error');
      if (previousErrorMsg) {
        previousErrorMsg.remove();
      }

    if (INPUT_CITY.value === '') {
      HEADER.textContent = 'The Weather App';
      clearPrevData();
      createHtmlElement('div', ERROR_INPUT_BLANK, ['error'], CONTAINER_CURRENT); 
    } else {
    clearPrevData();
    clarify(INPUT_CITY.value);
    getWeather(INPUT_CITY.value)
      .then(data => {
      renderPage(data);
      })
      .catch(() => {
        renderError();
      })
    }
  })
}

function clearPrevData() {
  clearPrevCitySuggestions();
  clear(CONTAINER_CURRENT);
  clear(CONTAINER_FORECAST);
}

function clearPrevCitySuggestions() {
  let previousSuggestionTextDiv = document.querySelector('.alt-suggestion');
  let previousFirstChoiceDiv = document.querySelector('.first-choice-city');
  let previousSuggestionDivs = document.querySelectorAll('.city-option');
  
  if (previousFirstChoiceDiv) {
    previousFirstChoiceDiv.remove();
  }
  if (previousSuggestionTextDiv) {
    previousSuggestionTextDiv.remove();
  }
  if (previousSuggestionDivs.length >= 1) {
    previousSuggestionDivs.forEach(div => div.remove());
  }
}

function clear(div) {
  div.innerHTML = '';
}

async function clarify(city) {
  function displayFirstChoiceCity(city) {
    let firstChoiceCityDiv = document.createElement('div');
    let firstchoiceCityText = document.createElement('p');

    firstChoiceCityDiv.classList.add('first-choice-city');
    firstchoiceCityText.innerHTML = `Showing the weather for 
                                      <span class='first-choice-city-text'>
                                      ${city.name}, ${city.region}, ${city.country}
                                      </span>`;

    CONTAINER_SEARCH.appendChild(firstChoiceCityDiv);
    firstChoiceCityDiv.appendChild(firstchoiceCityText);
  }

  function displayListOfAlternatives(cities) {
    let alternativeSuggestionDiv = document.createElement('div');
    let alternativeSuggestionText = document.createElement('p');

    alternativeSuggestionDiv.classList.add('alt-suggestion');
    alternativeSuggestionText.textContent = 'Or did you mean one of the following cities?'

    CONTAINER_SEARCH.appendChild(alternativeSuggestionDiv);
    alternativeSuggestionDiv.appendChild(alternativeSuggestionText);

    cities.forEach(city => {
      let cityOptionDiv = document.createElement('div');
      let cityOptionText = document.createElement('p');
      
      cityOptionDiv.classList.add('city-option');
      cityOptionText.textContent = `${city.name}, ${city.region}, ${city.country}`;

      CONTAINER_SEARCH.appendChild(cityOptionDiv);
      cityOptionDiv.appendChild(cityOptionText);

      cityOptionDiv.addEventListener('click', () => {
        INPUT_CITY.value = cityOptionDiv.children[0].innerText;
        BTN_SUBMIT.click();
      }) 
    });
  }
  
  let searchResults = await search(city);

  if (searchResults.listOfAlternativeCities.length >= 1) { //More than one possible city in search results
    displayFirstChoiceCity(searchResults.firstChoiceCity);
    displayListOfAlternatives(searchResults.listOfAlternativeCities);
  } else if (searchResults.listOfAlternativeCities.length === 0) { //No cities in search result
    console.log('No cities found');
  }
}
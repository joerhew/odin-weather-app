import getWeather, { search } from './weatherapi.js'

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
  
  //Current condition text and icon
  let currentConditionDiv = createHtmlElement('div', '', ['current-condition'], CONTAINER_CURRENT);

  let currentConditionIcon = document.createElement('img');
  currentConditionIcon.src = data.current.condition.icon
  currentConditionDiv.appendChild(currentConditionIcon);

  let currentTempDiv = createHtmlElement('div', `${data.current.temp_c} °C`, ['current-temp'], currentConditionDiv);
  let currentConditionText = createHtmlElement('p', data.current.condition.text, [], currentConditionDiv);
  
  //Current condition - other info
  let currentMiscDiv = createHtmlElement('div', '', ['current-other'], CONTAINER_CURRENT);

  let currentFeelsLikeDiv = createHtmlElement('div', `Feels like: ${data.current.feelslike_c} °C`, ['current-feels-like'], currentMiscDiv);
  let currentWind = createHtmlElement('div', `Wind speed: ${data.current.wind_kph} kph`, ['current-wind'], currentMiscDiv);
  let currentHumidity = createHtmlElement('div', `Humidity: ${data.current.humidity}%`, ['current-humidity'], currentMiscDiv);
  let currentPrecip = createHtmlElement('div', `Precipitation: ${data.current.precip_mm} mm`, ['current-precip'], currentMiscDiv);
  
  /*CONTAINER_CURRENT.textContent += data.current.temp_c;
  CONTAINER_CURRENT.textContent += data.current.feelslike_c;
  CONTAINER_CURRENT.textContent += data.current.wind_kph;
  CONTAINER_CURRENT.textContent += data.current.humidity;
  CONTAINER_CURRENT.textContent += data.current.precip_mm;*/
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

function renderForecast(data) {
  console.log(data.forecast)
  data.forecast.forEach(day => {
    CONTAINER_FORECAST.textContent += day.date;  
  })
}

function addListenerToButton() {
  BTN_SUBMIT.addEventListener('click', e => {
    e.preventDefault();
    clearPrevData();
    clarify(INPUT_CITY.value);
    getWeather(INPUT_CITY.value)
    .then(data => {
      renderPage(data);
    });
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
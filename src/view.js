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
  CONTAINER_CURRENT.textContent = data.current.feelslike_c;
}

function renderForecast(data) {
  console.log(data.forecast)
  CONTAINER_FORECAST.textContent = data.forecast[1].date;
}

function addListenerToButton() {
  BTN_SUBMIT.addEventListener('click', e => {
    e.preventDefault();
    clearPrevCitySuggestions();
    clarify(INPUT_CITY.value);
    getWeather(INPUT_CITY.value)
    .then(data => {
      renderPage(data);
    });
  })
}

function clearPrevCitySuggestions() {
  let previousFirstChoiceDiv = document.querySelector('.first-choice-city');
  let previousSuggestionDivs = document.querySelectorAll('.city-option');
  
  if (previousFirstChoiceDiv) {
    previousFirstChoiceDiv.remove();
  }
  if (previousSuggestionDivs.length >= 1) {
    previousSuggestionDivs.forEach(div => div.remove());
  }
}

async function clarify(city) {
  function displayFirstChoiceCity(city) {
    let firstChoiceCityDiv = document.createElement('div');
    let firstchoiceCityText = document.createElement('p');

    firstChoiceCityDiv.classList.add('first-choice-city');
    firstchoiceCityText.textContent = `Showing the weather for ${city.name}, ${city.region}, ${city.country}`;

    CONTAINER_SEARCH.appendChild(firstChoiceCityDiv);
    firstChoiceCityDiv.appendChild(firstchoiceCityText);
  }

  function displayListOfAlternatives(cities) {
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
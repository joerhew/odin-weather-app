let API_KEY = '081c359ab5aa425cbee205715231805';
let DAYS = 8;

async function forecast(city) {
  let apiForecast = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&aqi=no&days=${DAYS}`
  let response =  await fetch(apiForecast, {mode: 'cors'});
  let data = await response.json();
  console.log(data)
  return data;
}

async function getListofCities(city) {
  let apiSearch = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${city}`
  let response = await fetch(apiSearch, {mode: 'cors'});
  let data = await response.json();
  return data;
}

export default async function getWeather(city) {
  try {
    let rawData = await forecast(city);
    let processedData = processData(rawData);
    return processedData;
  } catch(err) {
    return err;
  }
}

export async function search(city) {
  let listOfCities = await getListofCities(city);
  let firstChoiceCity = listOfCities[0];
  let listOfAlternativeCities = listOfCities.slice(1);
  return { firstChoiceCity, listOfAlternativeCities };
}

function processData(data) {
  let {
    name, 
    country 
  } = data.location;
  let current = data.current;
  let forecast = data.forecast.forecastday;
  return { 
    name, country, //location 
    current, //current
    forecast //forecast
  }
}
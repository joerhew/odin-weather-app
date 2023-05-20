let API_KEY = '081c359ab5aa425cbee205715231805';
let DAYS = 14;

async function forecast(city) {
  let apiCall = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&aqi=no&days=${DAYS}`
  let response =  await fetch(apiCall, {mode: 'cors'});
  let data = await response.json();
  return data;
}

export default async function getWeather(city) {
  let rawData = await forecast(city);
  let processedData = processData(rawData);
  return processedData;
}

function processData(data) {
  let {
    name, 
    country 
  } = data.location;
  let {
    condition: {text: currentText, icon: currentIcon},
    temp_c: currentTemp_c, 
    feelslike_c: currentFeelslike_c,
    cloud: currentCloud,
    wind_kph: currentWind_kph,
    precip_mm: currentPrecip_mm,
    humidity: currentHumidity
  } = data.current;
  let forecast = data.forecast.forecastday;
  return { 
    name, country, //location 
    currentText, currentIcon, currentTemp_c, currentFeelslike_c, currentCloud, currentWind_kph, currentPrecip_mm, currentHumidity, //current
    forecast //forecast
  }
}
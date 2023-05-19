import forecast from './weatherapi.js'

let city = 'Toronto';

async function getWeatherData(city) {
  let rawData = await forecast(city);
  processData(rawData);
}

function processData(data) {
  let {
    name, 
    country 
  } = data.location;
  console.log('City: ' + name + ',' + country);
  let {
    condition: {text: currentText, icon: currentIcon},
    temp_c, 
    feelslike_c,
    cloud,
    wind_kph,
    precip_mm,
    humidity
  } = data.current;
  console.log("Current: " + currentText + " / " + temp_c + " / " + feelslike_c + " / " + cloud + " / " + wind_kph + " / " + precip_mm + " / " + humidity)
  //location
    //weatherData.location.name
    //weatherData.location.country
  //current
    //weatherData.current.condition.text
    //weatherData.current.condition.icon
    //weatherData.current.temp_c
    //weatherData.current.feelslike_c
    //weatherData.current.cloud
    //weatherData.current.wind_kph
    //weatherData.current.precip_mm
    //weatherData.current.humidity
  //forecast
    //weatherData.forecast.forecastday[i].date
    //weatherData.forecast.forecastday[i].day.condition.text
    //weatherData.forecast.forecastday[i].day.condition.icon
    //weatherData.forecast.forecastday[i].day.maxtemp_c
    //weatherData.forecast.forecastday[i].day.mintemp_c
    //weatherData.forecast.forecastday[i].day.totalprecip_mm
    //weatherData.forecast.forecastday[i].day.totalsnow_cm
    //weatherData.forecast.forecastday[i].day.daily_will_it_rain
    //weatherData.forecast.forecastday[i].day.daily_chance_of_rain
    //weatherData.forecast.forecastday[i].day.daily_will_it_snow
    //weatherData.forecast.forecastday[i].day.daily_chance_of_snow
    //weatherData.forecast.forecastday[i].astro.sunrise
    //weatherData.forecast.forecastday[i].astro.sunset
    console.log(data);
    console.log(data.location.name);
    console.log(data.location.country);
    console.log(data.current.condition.text);
    console.log(data.current.condition.icon);
    console.log(data.current.temp_c);
    console.log(data.current.feelslike_c);
    console.log(data.current.cloud);
    console.log(data.current.wind_kph);
    console.log(data.current.precip_mm);
    console.log(data.current.humidity);
    for (let i = 0; i < data.forecast.forecastday.length; i++) {
      console.log(data.forecast.forecastday[i].date)
      console.log(data.forecast.forecastday[i].day.condition.text)
      console.log(data.forecast.forecastday[i].day.condition.icon)
      console.log(data.forecast.forecastday[i].day.maxtemp_c)
      console.log(data.forecast.forecastday[i].day.mintemp_c)
      console.log(data.forecast.forecastday[i].day.totalprecip_mm)
      console.log(data.forecast.forecastday[i].day.totalsnow_cm)
      console.log(data.forecast.forecastday[i].day.daily_will_it_rain)
      console.log(data.forecast.forecastday[i].day.daily_chance_of_rain)
      console.log(data.forecast.forecastday[i].day.daily_will_it_snow)
      console.log(data.forecast.forecastday[i].day.daily_chance_of_snow)
      console.log(data.forecast.forecastday[i].astro.sunrise)
      console.log(data.forecast.forecastday[i].astro.sunset)
    }
}

getWeatherData(city)
import getWeather from './weatherapi.js'

let city = 'Toronto';

getWeather(city).then(data => console.log(data));
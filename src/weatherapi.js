let API_KEY = '081c359ab5aa425cbee205715231805';
let DAYS = 14;

export default async function forecast(city) {
  let apiCall = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&aqi=no&days=${DAYS}`
  let response =  await fetch(apiCall, {mode: 'cors'});
  let data = await response.json();
  return data;
}
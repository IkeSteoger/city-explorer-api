'use strict';

const axios = require('axios');

let cache = {};

async function getWeather(request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let key = `lat:${lat}-lon:${lon}`;

    if(cache[key] && (Date.now() - cache[key].timeStamp) < 8.64e+7){
      response.status(200).send(cache[key].data);
    } else {
      let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
      let weatherData = await axios.get(url);
      let dataToSend = weatherData.data.data.map(obj => new Forecast(obj));

      cache[key] = {
        data: dataToSend,
        timeStamp: Date.now(),
      };

      response.status(200).send(dataToSend);
    }
  } catch (error) {
    next(error);
  }
}

class Forecast {
  constructor(cityObj){
    this.description = `Low of ${cityObj.min_temp}, high of ${cityObj.max_temp} with ${cityObj.weather.description}`;
    this.valid_date = cityObj.valid_date;
  }
}

module.exports = getWeather;

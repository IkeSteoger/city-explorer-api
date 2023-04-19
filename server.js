'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`Yay we are up on port ${PORT}`));

app.get('/', (request, response)=> {
  response.status(200).send('Welcome to my server!');
});

app.get('/weather', async (request, response, next) => {

  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;

    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;

    let weatherData = await axios.get(url);

    let dataToSend = weatherData.data.data.map(obj => new Forecast(obj));

    response.status(200).send(dataToSend);

  } catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(cityObj){
    this.description = `Low of ${cityObj.min_temp}, high of ${cityObj.max_temp} with ${cityObj.weather.description}`;
    this.valid_date = cityObj.valid_date;
  }
}

app.get('/movie', async (request, response, next) => {
  try {
    let city = request.query.city;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;

    let movie = await axios.get(url);

    let dataToSend = movie.data.results.map(obj => new Movie(obj));

    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});

class Movie {
  constructor(movieObj){
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.poster = movieObj.poster_path;
  }
}

// ENDPOINT
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist.');
});

// ERROR HANDLING
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

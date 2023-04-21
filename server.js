'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./modules/weather');
const getMovie = require('./modules/movies');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`Yay we are up on port ${PORT}`));

app.get('/', (request, response)=> {
  response.status(200).send('Welcome to my server!');
});

app.get('/weather', getWeather);

app.get('/movie', getMovie);

// ENDPOINT
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist.');
});

// ERROR HANDLING
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

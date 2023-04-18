'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
let weatherData = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`Yay we are up on port ${PORT}`));

// class Weather {
//     constructor()
// }

app.get('/', (request, response)=> {
  response.status(200).send('Welcome to my server!');
});


app.get('/weather', (request, response, next) => {

  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;

    let foundCity = weatherData.find(city => (city.city_name === searchQuery) || (city.lon === lon) || (city.lat === lat));
    let dataToSend = new Forecast(foundCity);
    console.log(dataToSend);

    response.status(200).send(dataToSend);

  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

class Forecast {
  constructor(cityObj){
    // this.city_name = cityObj.city_name;
    this.description = `Low of ${cityObj.data[0].low_temp}, high of ${cityObj.data[0].high_temp} with ${cityObj.data[0].weather.description}`;
    this.valid_date = cityObj.data[0].valid_date;
  }
}

app.get('/hello', (request, response) => {
  let firstName = request.query.firstName;
  let lastName = request.query.lastName;

  response.status(200).send(`Hello ${firstName} ${lastName}, welcome to my server!`);
});


// ENDPOINT
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist.');
});

// ERROR HANDLING
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

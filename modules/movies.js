'use strict';

const axios = require('axios');

async function getMovie(request, response, next){
  try {
    let city = request.query.city;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;

    let movie = await axios.get(url);

    let dataToSend = movie.data.results.map(obj => new Movie(obj));

    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
}

class Movie {
  constructor(movieObj){
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.poster = movieObj.poster_path;
  }
}

module.exports = getMovie;


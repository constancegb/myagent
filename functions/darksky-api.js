const config = require('./config');
const request = require('superagent');

/**
* GET - Retreieve weather data from darksky API { docs at: https://darksky.net/dev/docs) }
*
* @param {String} day: user requested day
* @param {String} city: user requested city
* @returns {String} The bot response
*/
async function getWeather(day, city) {
  let location;
  let summary;

  if (city.includes('paris')) {
    location = config.coordinates.paris;
  } else if (city.includes('tokyo')) {
    location = config.coordinates.toky;
  } else if (city.includes('new york')) {
    location = config.coordinates.newYork;
  } else {
    return `I am sorry I could not recognize the name of your ${city}. Please try again`;
  }

  const url = `${config.baseUrl}/${config.apiKey}/${location}?${config.query}`;

  const response = await request
    .get(url);

  if (day === 'today') {
    summary = response.daily.data[1].summary;
  } else if (day === 'tomorrow') {
    summary = response.daily.data[1].summary;
  } else {
    return `I am sorry I do not have acces to weather info for ${day}. Please try again`;
  }
  return `${day} is going to be ${summary}`;
}


module.exports = {
  getWeather
};

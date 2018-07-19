const baseUrl = 'https://api.darksky.net/forecast';
const apiKey = 'e50b9fb086bf2504e2bfec90724b024e';
const query = 'units=si&exclude=minutely,hourly,alerts,flags';

const coordinates = {
  tokyo: '35.694798,139.748302',
  paris: '48.859092,2.339956',
  newYork: '40.768223,-73.976916'
};

module.exports = {
  baseUrl,
  apiKey,
  query,
  coordinates
};

const assert = require('assert');
const nock = require('nock');

const config = require('../config');
const { getWeather } = require('../darksky-api');
const { sampleData } = require('./fixtures');

describe('test', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe('APP#MYAGENT', () => {
  describe('getWeather', () => {
    it('returns the appropriate weather information for today, in paris', function*() {
      const baseUrl = config.baseUrl;
      const path = `/${config.apiKey}/48.859092,2.339956?${config.query}`;

      nock(baseUrl)
        .get(path)
        .reply(200, sampleData);

      const result = yield getWeather('today', 'paris');

      assert.equal(result, 'Partly cloudy throughout the day.');
    });
  });
});

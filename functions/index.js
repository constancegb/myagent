/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google');

const { getWeather } = require('./darksky-api');
const responses = require('./responses');

const app = dialogflow();


app.intent('Default Welcome Intent', conv => {
  conv.ask('Welcome to my agent!');
});

app.intent('Default Fallback Intent', conv => {
  conv.ask(`I didn't understand`);
  conv.ask(`I'm sorry, can you try again?`);
});

app.intent('Name', conv => {
  conv.ask('My name is Dialogflow!');
});


/**
* Gives the user a summary of weather information for requested day & city
* OR, prompt the user for a day and/or a city (whichever is/are undefined)
*/
app.intent('Weather', (conv, {day, city}) => {
  let botResponse;

  if (day && city) {
    conv.ask(`Alright! Let me retrieve weather info for ${day} in ${city}`);
    botResponse = getWeather(day, city);
  } else if (day && !city) {
    conv.ask(responses.requireMissingParameters.city);
    conv.contexts.set('Weather-followup', 2, {day});
  } else if (!day && city) {
    conv.ask(responses.requireMissingParameters.day);
    conv.contexts.set('Weather-followup', 2, {city});
  } else {
    conv.ask(responses.requireMissingParameters.dayAndCity);
  }

  conv.ask(botResponse);
});


/**
* Gives the user a summary of weather information for requested day & city
* OR, prompt the user for a day if it is still missing from its voice request
*/
app.intent('Weather-city', (conv, {day}) => {
  let botResponse;

  const weatherContext = conv.contexts.get('Weather-followup');
  const city = weatherContext.parameters.city;

  if (!day) {
    conv.ask(responses.requireMissingParameters.day);
    conv.contexts.set('Weather-city-followup', 1, {day});
  } else {
    botResponse = getWeather(day, city);
  }

  conv.ask(botResponse);
});


/**
* Gives the user a summary of weather information for requested day & city
* OR, prompt the user for a city if it is still missing from its voice request
*/
app.intent('Weather-day', (conv, {city}) => {
  let botResponse;

  const weatherContext = conv.contexts.get('Weather-followup');
  const day = weatherContext.parameters.day;

  if (!city) {
    conv.ask(responses.requireMissingParameters.city);
    conv.contexts.set('Weather-day-followup', 1, {day});
  } else {
    botResponse = getWeather(day, city);
  }

  conv.ask(botResponse);
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

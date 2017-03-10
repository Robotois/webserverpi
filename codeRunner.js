// robotios requires
/* eslint-disable*/
const Light = require('robotois-light-sensor');
const Led = require('robotois-led');
const Temperature = require('robotois-temperature-sensor');
const LCD = require('robotois-lcd-display');
const Rotatory = require('robotois-rotatory-sensor');
const Button = require('robotois-button');
const Line = require('robotois-line-sensor');
const Motors = require('robotois-motors');
/* eslint-enable*/
const Distance = require('../eModules/NodeLibrary/UltrasonicSensor');
const LedRGB = require('../eModules/NodeLibrary/RGBModule');

/* eslint-disable one-var */
let light,
  led,
  temperature,
  lcd,
  rotatory,
  distance,
  button,
  ledRGB;
// get data from params
const data = JSON.parse(process.env.data);
const modules = data.modules;

// light sensor
if (modules.light && modules.light.port) {
  light = new Light(modules.light.port);
}
// led
if (modules.led && modules.led.port) {
  led = new Led(modules.led.port);
}
// temperature
if (modules.temperature && modules.temperature.port) {
  temperature = new Temperature(modules.temperature.port);
}
// lcd
if (modules.lcd && modules.lcd.port) {
  lcd = new LCD();
}
// rotatory
if (modules.rotatory && modules.rotatory.port) {
  rotatory = new Rotatory(modules.rotatory.port);
}
// distance
if (modules.distance && modules.distance.port) {
  distance = new Distance(modules.distance.port);
}
// button
if (modules.button && modules.button.port) {
  button = new Button(modules.button.port);
}
// ledRGB
if (modules.ledRGB && modules.ledRGB.port) {
  ledRGB = new LedRGB();
}
/* eslint-disable no-eval */
eval(data.code);

setInterval(() => {}, 10000);

/**
 * Releases all components resources
 * @param {object} options The options object.
 * @param {object} err The error object.
 * @returns {int} .
 */
function exitHandler() {
  // light sensor
  if (modules.light && modules.light.port) {
    light.release();
  }
  // led
  if (modules.led && modules.led.port) {
    led.release();
  }
  // temperature
  if (modules.temperature && modules.temperature.port) {
    temperature.release();
  }
  // lcd
  if (modules.lcd && modules.lcd.port) {
    lcd.release();
  }
  // rotatory
  if (modules.rotatory && modules.rotatory.port) {
    rotatory.release();
  }
  // distance
  if (modules.distance && modules.distance.port) {
    distance.release();
  }
  // button
  if (modules.button && modules.button.port) {
    button.release();
  }
  // ledRGB
  if (modules.ledRGB && modules.ledRGB.port) {
    ledRGB.release();
  }
  process.exit();
}

process.on('SIGTERM', exitHandler);
process.on('SIGINT', exitHandler);
process.on('exit', exitHandler);

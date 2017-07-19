// robotios requires
/* eslint-disable*/
const Light = require('robotois-light-sensor');
const Led = require('robotois-led');
const Temperature = require('robotois-temperature-sensor');
const LCD = require('robotois-lcd-display');
const Rotary = require('robotois-rotary-sensor');
const Button = require('robotois-button');
const Line = require('robotois-line-sensor');
const Motors = require('robotois-motors');
const Distance = require('robotois-distance-sensor');
const LedRGB = require('robotois-rgb-leds');
const Servos = require('robotois-servos');
/* eslint-enable*/

/* eslint-disable one-var */
let light,
  led,
  temperature,
  lcd,
  rotary,
  distance,
  button,
  ledRGB,
  motor,
  servo;
// get data from params
const data = JSON.parse(process.env.data);
const modules = data.modules;

// light sensor
if (modules.light && modules.light.port) {
  light = new Light(modules.light.port);
  light.enableEvents();
}
// led
if (modules.led && modules.led.port) {
  led = new Led(modules.led.port);
}
// temperature
if (modules.temperature && modules.temperature.port) {
  temperature = new Temperature(modules.temperature.port);
  temperature.enableEvents();
}
// lcd
if (modules.lcd && modules.lcd.port) {
  lcd = new LCD();
}
// rotary
if (modules.rotary && modules.rotary.port) {
  rotary = new Rotary(modules.rotary.port);
  rotary.enableEvents();
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
// ledRGB
if (modules.servo && modules.servo.port) {
  servo = new Servos(0);
}
// ledRGB
if (modules.motor && modules.motor.port) {
  motor = new Motors();
}
/* eslint-disable no-eval */
eval(data.code);
// eval('console.log("Hello from child")')
// setInterval(() => {}, 10000);

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
  // rotary
  if (modules.rotary && modules.rotary.port) {
    rotary.release();
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
  // servos
  if (modules.servo && modules.servo.port) {
    servo.release();
  }
  // motors
  if (modules.motor && modules.motor.port) {
    motor.release();
  }
  process.exit();
}

process.on('SIGTERM', exitHandler);
process.on('SIGINT', exitHandler);
process.on('exit', exitHandler);

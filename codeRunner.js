// robotios requires
/* eslint-disable*/
const Light = require('robotois-light-sensor');
const Sound = require('robotois-sound-sensor');
const Led = require('robotois-led');
const Temperature = require('robotois-temperature-sensor');
const LCD = require('robotois-lcd-display');
const Rotary = require('robotois-rotary-sensor');
const Button = require('robotois-button');
const Line = require('robotois-line-sensor');
const MotorController = require('robotois-motor-controller');
const Distance = require('robotois-distance-sensor');
const LedRGB = require('robotois-rgb-leds');
const ServoController = require('robotois-servos');
const Motion = require('robotois-motion-sensor');
const Relay = require('robotois-relay');
/* eslint-enable*/

/* eslint-disable one-var */
const light = [],
  led = [],
  temperature = [],
  sound = [],
  lcd = [],
  rotary = [],
  distance = [],
  button = [],
  motion = [],
  relay = [],
  ledRGB = [],
  motorControllers = [],
  motor = [],
  servoControllers = [],
  servo = [];
// get data from params

const getController = (Controller, instance, controllers) => {
  // console.log('instance: ', instance);
  const exists = controllers.find(cont => cont.instance === instance);
  if (!exists) {
    const newController = {
      instance,
      controller: new Controller(instance),
    };
    controllers.push(newController);
    return newController.controller;
  }
  return exists.controller;
};

const data = JSON.parse(process.env.data);

const connections = data.connections;
connections.sort((a, b) => a.instance - b.instance);
connections.forEach((toi) => {
  let toiItem;
  let controller;
  switch (toi.type) {
    case 'sound':
      toiItem = new Sound(toi.parent.port, toi.parent.instance - 1);
      toiItem.enableEvents();
      sound.push(toiItem);
      break;
    case 'rotary':
      toiItem = new Rotary(toi.parent.port, toi.parent.instance - 1);
      toiItem.enableEvents();
      rotary.push(toiItem);
      break;
    case 'light':
      toiItem = new Light(toi.parent.port, toi.parent.instance - 1);
      toiItem.enableEvents();
      light.push(toiItem);
      break;
    case 'temperature':
      toiItem = new Temperature(toi.parent.port, toi.parent.instance - 1);
      toiItem.enableEvents();
      temperature.push(toiItem);
      break;
    case 'led':
      led.push(new Led(toi.parent.port));
      break;
    case 'relay':
      relay.push(new Relay(toi.parent.port));
      break;
    case 'lcd':
      lcd.push(new LCD(toi.instance - 1)); // Traducing instance to I2C address
      break;
    case 'distance':
      toiItem = new Distance(toi.parent.port);
      toiItem.enableEvents();
      distance.push(toiItem);
      break;
    case 'button':
      toiItem = new Button(toi.parent.port);
      toiItem.enableEvents();
      button.push(toiItem);
      break;
    case 'motion':
      toiItem = new Motion(toi.parent.port);
      toiItem.enableEvents();
      button.push(toiItem);
      break;
    case 'ledRGB':
      ledRGB.push(new LedRGB(toi.instance - 1)); // Traducing instance to I2C address
      break;
    case 'servo':
      // Traducing instance to I2C address
      controller = getController(ServoController, toi.parent.instance - 1, servoControllers);
      toiItem = controller.createServo(toi.parent.port);
      servo.push(toiItem);
      break;
    case 'motor':
      // Traducing instance to I2C address
      controller = getController(MotorController, toi.parent.instance - 1, motorControllers);
      toiItem = controller.createMotor(toi.parent.port);
      motor.push(toiItem);
      break;
    default:
  }
});

eval(data.code);

/* eslint-disable no-eval */
// eval('console.log("Hello from child")')
// setInterval(() => {}, 10000);

const releaser = (toiVect) => {
  toiVect.forEach(toi => toi.release());
};

/**
 * Releases all components resources
 * @param {object} options The options object.
 * @param {object} err The error object.
 * @returns {int} .
 */
function exitHandler() {
  releaser(light);
  releaser(sound);
  releaser(temperature);
  releaser(rotary);
  releaser(led);
  releaser(lcd);
  releaser(relay);
  releaser(distance);
  releaser(button);
  releaser(motion);
  releaser(ledRGB);
  releaser(servoControllers);
  releaser(motorControllers);
  process.exit();
}

process.on('SIGTERM', exitHandler);
process.on('SIGINT', exitHandler);
// process.on('exit', exitHandler);

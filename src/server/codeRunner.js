// robotios requires
/* eslint-disable*/
const mqtt = require('mqtt');
const Light = require('robotois-light-sensor');
const Sound = require('robotois-sound-sensor');
const Led = require('robotois-led');
const Temperature = require('robotois-temperature-sensor');
const LCD = require('../../../robotois-lcd-display');
const Rotary = require('robotois-rotary-sensor');
const Button = require('robotois-button');
const Line = require('robotois-line-sensor');
const MotorController = require('robotois-motor-controller');
const Distance = require('robotois-distance-sensor');
const LedRGB = require('robotois-rgb-leds');
const ServoController = require('robotois-servo-controller');
const Motion = require('robotois-motion-sensor');
const Relay = require('robotois-relay');
/* eslint-enable*/

/* eslint-disable one-var */
const mqttTopics = [],
  light = [],
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

const allTopics = () => mqttTopics.reduce(
  (result, el) => result.concat(`${el.topic};`),
  '',
);

const requestTopic = (topic, client) => {
  if (topic === 'all') {
    client.publish('allTopics', allTopics());
    return;
  }
  const topicElement = mqttTopics.find(el => el.topic === topic);
  if (topicElement) {
    topicElement.topicToi.publishNow();
  }
};

const mqttHost = process.env.mqttHost;
const mqttClient = mqtt.connect({ host: mqttHost, port: 1883 });

const subscriber = () => new Promise((resolve) => {
  mqttClient.on('connect', () => {
    mqttClient.subscribe('requestTopic');
    resolve(true);
  });
});

mqttClient.on('message', (topic, message) => {
  switch (topic) {
    case 'requestTopic':
      requestTopic(message.toString(), mqttClient);
      break;
    default:
  }
});

const createToiWithEvents = (ToiType, toiConfig) => {
  const newToi = toiConfig.parentInstance ?
    new ToiType(toiConfig.parentPort, toiConfig.parentInstance) :
    new ToiType(toiConfig.parentPort);
  newToi.enableEvents({
    mqttClient,
    instance: toiConfig.toiInstance,
  });
  mqttTopics.push({
    topic: newToi.myTopic,
    topicToi: newToi,
  });
  // console.log(newToi.myTopic);
  return newToi;
};

const data = JSON.parse(process.env.data);
const { connections } = data.connections;

const runner = async () => {
  await subscriber();
  connections.sort((a, b) => a.instance - b.instance);
  connections.forEach((toi) => {
    let toiItem;
    let controller;
    switch (toi.type) {
      case 'sound':
        sound.push(createToiWithEvents(
          Sound,
          {
            parentPort: toi.parent.port,
            parentInstance: toi.parent.instance - 1,
            toiInstance: toi.instance,
          },
        ));
        break;
      case 'rotary':
        rotary.push(createToiWithEvents(
          Rotary,
          {
            parentPort: toi.parent.port,
            parentInstance: toi.parent.instance - 1,
            toiInstance: toi.instance,
          },
        ));
        break;
      case 'light':
        light.push(createToiWithEvents(Light,
          {
            parentPort: toi.parent.port,
            parentInstance: toi.parent.instance - 1,
            toiInstance: toi.instance,
          },
        ));
        break;
      case 'temperature':
        temperature.push(createToiWithEvents(
          Temperature,
          {
            parentPort: toi.parent.port,
            parentInstance: toi.parent.instance - 1,
            toiInstance: toi.instance,
          },
        ));
        break;
      case 'distance':
        distance.push(createToiWithEvents(
          Distance,
          {
            parentPort: toi.parent.port,
            toiInstance: toi.instance,
          },
        ));
        break;
      case 'button':
        button.push(createToiWithEvents(
          Button,
          {
            parentPort: toi.parent.port,
            toiInstance: toi.instance,
          },
        ));
        break;
      case 'motion':
        motion.push(createToiWithEvents(
          Motion,
          {
            parentPort: toi.parent.port,
            toiInstance: toi.instance,
          },
        ));
        break;
      case 'led':
        toiItem = new Led(toi.parent.port);
        toiItem.setMqttClient({
          mqttClient,
          instance: toi.instance,
        });
        mqttTopics.push({
          topic: toiItem.myTopic,
          topicToi: toiItem,
        });
        led.push(toiItem);
        break;
      case 'relay':
        toiItem = new Relay(toi.parent.port);
        toiItem.setMqttClient({
          mqttClient,
          instance: toi.instance,
        });
        mqttTopics.push({
          topic: toiItem.myTopic,
          topicToi: toiItem,
        });
        relay.push(toiItem);
        break;
      case 'lcd':
        toiItem = new LCD(toi.instance - 1);
        toiItem.setMqttClient({
          mqttClient,
          instance: toi.instance,
        });
        mqttTopics.push({
          topic: toiItem.myTopic,
          topicToi: toiItem,
        });
        lcd.push(toiItem); // Traducing instance to I2C address
        break;
      case 'ledRGB':
        toiItem = new LedRGB(toi.instance - 1);
        toiItem.setMqttClient({
          mqttClient,
          instance: toi.instance,
        });
        mqttTopics.push({
          topic: toiItem.myTopic,
          topicToi: toiItem,
        });
        ledRGB.push(toiItem); // Traducing instance to I2C address
        break;
      case 'servo':
        // Traducing instance to I2C address
        controller = getController(ServoController, toi.parent.instance - 1, servoControllers);
        toiItem = controller.createServo(
          toi.parent.port,
          {
            mqttClient,
            instance: toi.instance,
          },
        );
        mqttTopics.push({
          topic: toiItem.myTopic,
          topicToi: toiItem,
        });
        servo.push(toiItem);
        break;
      case 'motor':
        // Traducing instance to I2C address
        controller = getController(MotorController, toi.parent.instance - 1, motorControllers);
        toiItem = controller.createMotor(
          toi.parent.port,
          {
            mqttClient,
            instance: toi.instance,
          },
        );
        mqttTopics.push({
          topic: toiItem.myTopic,
          topicToi: toiItem,
        });
        motor.push(toiItem);
        break;
      default:
    }
  });

  eval(data.code || '');
};

runner();

/* eslint-disable no-eval */
// eval('console.log("Hello from child")')
// setInterval(() => {}, 10000);

const releaser = (toiVect) => {
  toiVect.forEach((toi) => {
    if (toi.instance !== undefined) {
      toi.controller.release();
      return;
    }
    toi.release();
  });
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
// process.on('exit', () => {
//   console.log('I\'m out');
// });

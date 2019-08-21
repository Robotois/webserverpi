const mqtt = require('mqtt');
const Distance = require('../../../../robotois-distance-sensor/src/index.js');

const toiId = 'SuperToi'
const toiTopic = `tois/${toiId}/update`
const tois = []

const getController = (Controller, instance, controllers) => {
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

const mqttHost = process.env.mqttHost;
const mqttClient = mqtt.connect({ host: mqttHost });

const data = JSON.parse(process.env.data);
const { connections } = data.connections;

const publisher = (topic, state) => {
  mqttClient.publish(topic, state)
}

const createToiWithEvents = (ToiType, toiConfig) => {
  const newToi = toiConfig.parentInstance ?
    new ToiType(toiConfig.parentPort, toiConfig.parentInstance) :
    new ToiType(toiConfig.parentPort);
  newToi.enableEvents({
    updateTopic: toiTopic,
    publish: publisher,
    instance: toiConfig.instance,
  });
  return newToi;
};

const runner = () => {
  connections.sort((a, b) => a.instance - b.instance);
  connections.forEach((toi) => {
    let toiItem;
    let controller;
    switch (toi.type) {
      case 'distance':
        tois.push(createToiWithEvents(
          Distance,
          {
            parentPort: toi.parent.port,
            instance: toi.instance,
          },
        ));
        break;
      // case 'led':
      //   toiItem = new Led(toi.parent.port);
      //   toiItem.setMqttClient({
      //     mqttClient,
      //     instance: toi.instance,
      //   });
      //   mqttTopics.push({
      //     topic: toiItem.myTopic,
      //     topicToi: toiItem,
      //   });
      //   led.push(toiItem);
      //   break;
      // case 'relay':
      //   toiItem = new Relay(toi.parent.port);
      //   toiItem.setMqttClient({
      //     mqttClient,
      //     instance: toi.instance,
      //   });
      //   mqttTopics.push({
      //     topic: toiItem.myTopic,
      //     topicToi: toiItem,
      //   });
      //   relay.push(toiItem);
      //   break;
      // case 'lcd':
      //   toiItem = new LCD(toi.instance - 1);
      //   toiItem.setMqttClient({
      //     mqttClient,
      //     instance: toi.instance,
      //   });
      //   mqttTopics.push({
      //     topic: toiItem.myTopic,
      //     topicToi: toiItem,
      //   });
      //   lcd.push(toiItem); // Traducing instance to I2C address
      //   break;
      // case 'ledRGB':
      //   toiItem = new LedRGB(toi.instance - 1);
      //   toiItem.setMqttClient({
      //     mqttClient,
      //     instance: toi.instance,
      //   });
      //   mqttTopics.push({
      //     topic: toiItem.myTopic,
      //     topicToi: toiItem,
      //   });
      //   ledRGB.push(toiItem); // Traducing instance to I2C address
      //   break;
      // case 'servo':
      //   // Traducing instance to I2C address
      //   controller = getController(ServoController, toi.parent.instance - 1, servoControllers);
      //   toiItem = controller.createServo(
      //     toi.parent.port,
      //     {
      //       mqttClient,
      //       instance: toi.instance,
      //     },
      //   );
      //   mqttTopics.push({
      //     topic: toiItem.myTopic,
      //     topicToi: toiItem,
      //   });
      //   servo.push(toiItem);
      //   break;
      // case 'motor':
      //   // Traducing instance to I2C address
      //   controller = getController(MotorController, toi.parent.instance - 1, motorControllers);
      //   toiItem = controller.createMotor(
      //     toi.parent.port,
      //     {
      //       mqttClient,
      //       instance: toi.instance,
      //     },
      //   );
      //   mqttTopics.push({
      //     topic: toiItem.myTopic,
      //     topicToi: toiItem,
      //   });
      //   motor.push(toiItem);
      //   break;
      default:
    }
  });

  eval(data.code || '');
};

runner();

/* eslint-disable no-eval */
// eval('console.log("Hello from child")')

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
  releaser(tois);
  process.exit();
}

process.on('SIGTERM', exitHandler);
process.on('SIGINT', exitHandler);

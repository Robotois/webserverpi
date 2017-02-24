// robotios requires
const Light = require('../eModules/NodeLibrary/LightSensor');
const Led  =  require('../eModules/NodeLibrary/LEDModule');
const Temperature  =  require('../eModules/NodeLibrary/TemperatureSensor');
const LCD  =  require('../eModules/NodeLibrary/LCDModule');
const Rotatory  =  require('../eModules/NodeLibrary/RotarySensor');
const Distance  =  require('../eModules/NodeLibrary/UltrasonicSensor');
const Button  =  require('../eModules/NodeLibrary/ButtonModule');
const LedRGB  =  require('../eModules/NodeLibrary/RGBModule');

function resetTois(data) {
  const modules = data.modules;

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

  setInterval(()=>{ // Proceso en estado ocioso
    true;
  }, 10000);

  process.on('SIGTERM', function () {
    process.exit();
  });

  process.on('SIGINT', function () {
    process.exit();
  });
}

module.exports = resetTois;

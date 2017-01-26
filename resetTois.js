// robotios requires
const Light = require('../eModules/NodeLibrary/LightModule');
const Led  =  require('../eModules/NodeLibrary/LEDModule');
const Temperature  =  require('../eModules/NodeLibrary/TempModule');
const LCD  =  require('../eModules/NodeLibrary/LCDModule');
const Rotatory  =  require('../eModules/NodeLibrary/RotaryModule');
const Distance  =  require('../eModules/NodeLibrary/UltrasonicModule');
const Button  =  require('../eModules/NodeLibrary/ButtonModule');
const LedRGB  =  require('../eModules/NodeLibrary/RGBModule');

function resetTois(data) {
  const modules = data.modules;

  // led
  if (modules.led && modules.led.port) {
    led = new Led(modules.led.port);
    led.turnOff();
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


// robotios requires
const Light = require('../eModules/NodeLibrary/LightModule');
const Led  =  require('../eModules/NodeLibrary/LEDModule');
const Temperature  =  require('../eModules/NodeLibrary/TempModule');
const LCD  =  require('../eModules/NodeLibrary/LCDModule');
const Rotatory  =  require('../eModules/NodeLibrary/RotaryModule');
const Distance  =  require('../eModules/NodeLibrary/UltrasonicModule');
const Button  =  require('../eModules/NodeLibrary/ButtonModule');
const LedRGB  =  require('../eModules/NodeLibrary/RGBModule');

// get data from params
console.log('**********we got data***********' + process.env);
const data = process.env.data;
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

eval(data.code);

setInterval(()=>{ // Proceso en estado ocioso
  true;
},10000);

process.on('SIGTERM', function () {
  process.exit();
});

process.on('SIGINT', function () {
  process.exit();
});

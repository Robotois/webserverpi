var _loops = require('../libs/loops'),
    loops = new _loops(),
    sleep = require('sleep'),
    _line_sensors = require('../externals/eModules/NodeLibrary/LineSensorsModule'),
    line_sensors = new _line_sensors();

var _lcd = require('../externals/eModules/NodeLibrary/LCDModule'),
  lcd = new _lcd();

var _leds  =  require('../externals/eModules/NodeLibrary/LEDsModule'),
  leds = new _leds(2);

/** Hexadecimal/Binary value for sensors status **/
// setInterval(()=>{
//   console.log("Sensors[hex]: " + line_sensors.ReadSensors().toString(16) +
//   ", Sensors[dec]: " + line_sensors.ReadLine() +
//   ", Sensors[bin]: " + ("000000" + line_sensors.ReadSensors().toString(2)).slice(-6) );
// },1000);

// /** Single Sensor Status **/
// setInterval(()=>{
//   console.log("Sensor[2]: " + line_sensors.ReadSensor(2));
// },1000);

/** Hexadecimal/Binary value for sensors status **/
// setInterval(()=>{
//   console.log("Sensors[hex]: " + line_sensors.ReadSensors().toString(16) +
//   ", Sensors[dec]: " + line_sensors.ReadLine() +
//   ", Sensors[bin]: " + ("000000" + line_sensors.ReadSensors().toString(2)).slice(-6) );
// },1000);

/** LCD Display for Sensors status **/
// var currentValue = line_sensors.ReadSensors(),
//   prevValue = currentValue;
// var currentLine = line_sensors.ReadLine(),
//   prevLine = currentLine;
//
// lcd.Message("Sensors: " + ("000000" + line_sensors.ReadSensors().toString(2)).slice(-6) +
//   "\nLine: " + ("    " + (currentLine.toFixed(2)-250).toString()).slice(-4));
//
// setInterval(()=>{
//   currentValue = line_sensors.ReadSensors();
//   currentLine = line_sensors.ReadLine();
//   console.log("Line: " + currentLine);
//   if(currentValue != prevValue){
//     lcd.SetCursor(1,10);
//     lcd.Message(("000000" + line_sensors.ReadSensors().toString(2)).slice(-6));
//     prevValue = currentValue;
//   }
//   if(currentLine != prevLine){
//     lcd.SetCursor(2,7);
//     lcd.Message(('      ' + (currentLine.toFixed(2)-250)).slice(-4));
//     prevLine = currentLine;
//   }
// },500);

var currentLine = line_sensors.ReadLine(),
  prevLine = currentLine;

setInterval(()=>{
  currentLine = line_sensors.ReadLine() - 250;
  if(currentLine < 0){
    leds.setLED1(1);
    leds.setLED2(0);
  }
  if(currentLine > 0){
    leds.setLED1(0);
    leds.setLED2(1);
  }
},100);

process.on('SIGINT', function () {
  leds.unexport();
  // buttons.unexport();
  process.exit();
});

process.on('SIGTERM', function () {
  leds.unexport();
  // buttons.unexport();
  process.exit();
});

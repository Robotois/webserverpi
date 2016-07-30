var _loops = require('../libs/loops'),
    loops = new _loops(),
    sleep = require('sleep');

var _rotary = require('../externals/eModules/NodeLibrary/RotaryModule'),
  rotary = new _rotary(1);

var _rgb = require('../externals/eModules/NodeLibrary/RGBModule'),
  rgb = new _rgb();

var sleep = require('sleep');

var _lcd = require('../externals/eModules/NodeLibrary/LCDModule'),
  lcd = new _lcd();

// var _leds  =  require('../externals/eModules/NodeLibrary/LEDsModule'),
//   leds = new _leds(2);

// loops.forever(() => { // - while body
//     if(rotary.ScaledValue() > 512){
//       leds.setLED1(1);
//     }else {
//       leds.setLED1(0);
//     }
// });
lcd.Message('Welcome to\nRobotois :D');
sleep.sleep(3);
lcd.Clear();

var value = rotary.Value();
lcd.Message("Value: " + value.toFixed(2));
rgb.SetRGB(1,51, 204, 51);
rgb.SetRGB(2,0,0,0);
rgb.SetRGB(3,0, 0, 0);

setInterval(()=>{
  lcd.SetCursor(1,8);
  value = rotary.Value();

  lcd.Message(value.toFixed(2));

  if(value > 0.5){
    rgb.SetRGB(1,51, 204, 51);
    rgb.SetRGB(2,0,0,0);
    rgb.SetRGB(3,0, 0, 0);
  }
  if(value > 2.5){
    rgb.SetRGB(2,255, 153, 51);
    rgb.SetRGB(3,0,0,0);
  }
  if(value > 4){
    rgb.SetRGB(3,255, 0, 0);
    lcd.bklBlink();
  }
},1000);
// loops.forever(()=>{
//
// });

process.on('SIGINT', function () {
  // leds.unexport();
  process.exit();
});

process.on('SIGTERM', function () {
  // leds.unexport();
  process.exit();
});

var _leds  =  require('../externals/eModules/NodeLibrary/LEDsModule'),
  leds = new _leds(2);
var _buttons = require('../externals/eModules/NodeLibrary/ButtonModule'),
  buttons = new _buttons(1);

var _loops = require('../libs/loops'),
  loops = new _loops();

// loops.while(
//   () => {return true}, // - stop contidion
//   () => { // - while body
//     // console.log(buttons.readButton1());
//     leds.setLED1(buttons.readButton1());
//     leds.setLED2(buttons.readButton2());
//   });
//

// loops.while(
//   () => {return true}, // - stop contidion
//   () => { // - while body
//     // console.log(buttons.readButton1());
//     leds.setLED1(buttons.readButton1());
//     leds.setLED2(buttons.readButton2());
//   });

setInterval(()=>{
  leds.led1_blink();
},2000);

process.on('SIGINT', function () {
  leds.unexport();
  buttons.unexport();
  process.exit();
});

process.on('SIGTERM', function () {
  leds.unexport();
  buttons.unexport();
  process.exit();
});

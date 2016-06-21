var _leds  =  require('../externals/eModules/NodeLibrary/LEDsModule'),
  leds = new _leds();
var _buttons = require('../externals/eModules/NodeLibrary/ButtonModule'),
  buttons = new _buttons();

var _loops = require('../libs/loops'),
  loops = new _loops();

loops.while(
  () => {return true}, // - stop contidion
  () => { // - while body
    leds.setLED1(buttons.readButton1());
    leds.setLED2(buttons.readButton2());
  });

var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();
// robotios requires
const Light = require('../eModules/NodeLibrary/LightModule');
const Led  =  require('../eModules/NodeLibrary/LEDModule');
const Temperature  =  require('../eModules/NodeLibrary/TempModule');
const LCD  =  require('../eModules/NodeLibrary/LCDModule');

var light, led, temperature, lcd;

app.use(logger());

app.use(route.get('/', home));
app.use(route.post('/post', show));

function *home() {
  this.body = 'Hello World';
}

function *show() {
   var data = yield parse(this);
   console.log(data);
   this.body = runCode(data);
}

// listen

app.listen(8082);
console.log('listening on port 8082');

//exec code
function runCode(data) {
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

  if (!data.code) {
    return {
      success: false,
      message: 'No code was provided'
    }
  }
  eval(data.code);
  footer();
  return {
    success: true,
    message: 'exito!'
  };
};

function footer() {
  setInterval(()=>{ // Proceso en estado ocioso
    true;
  },10000);

  process.on('SIGTERM', function () {
    process.exit();
  });

  process.on('SIGINT', function () {
    process.exit();
  });
}

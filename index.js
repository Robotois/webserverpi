//var service = require('./controllers/service.js');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();
// middleware

app.use(logger());

app.use(route.get('/', home));
app.use(route.post('/post', show));

function *home() {
  this.body = 'Hello World';
}

function *show() {
   var data = yield parse(this);
   this.body = data;
  //  leds();
  distance();
}

// listen

app.listen(8082);
console.log('listening on port 8082');

function leds(){
  var rgbs = require('../eModules/piModules/NodeLibrary/RGBModule')
  var sleep = require('sleep');

  rgbs.SetRGB(1,128,0,128); // Purple
  rgbs.SetRGB(2,0,0,0); // dark turquoise
  rgbs.SetRGB(3,0,0,0); // Olive

  sleep.sleep(1);
  rgbs.ledOff(1);
  sleep.sleep(1);
  rgbs.SetRGB(1,128,0,128); // Purple

  sleep.sleep(1);
  rgbs.ledOff(1);
  sleep.sleep(1);
  rgbs.SetRGB(1,128,0,128); // Purple

  sleep.sleep(1);
  rgbs.ledOff(1);
  sleep.sleep(1);
  rgbs.SetRGB(1,128,0,128); // Purple

  sleep.sleep(1);
  rgbs.ledOff(1);
  sleep.sleep(1);
  rgbs.SetRGB(1,128,0,128); // Purple

  sleep.sleep(1);
  rgbs.ledOff(1);
  sleep.sleep(1);
  rgbs.SetRGB(1,128,0,128); // Purple
}

function distance(){
  var dist = require('../eModules/piModules/NodeLibrary/DistanceModule');
  var distModule = dist(1);

  // setInterval(function () {
    console.log("The current Distance is: "+distModule.Distance());
  // },500);

}

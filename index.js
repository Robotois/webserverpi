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
   console.log(data.led3);
   leds(data);
   this.body = {success: true, message: 'exito!'};
}

// listen

app.listen(8082);
console.log('listening on port 8082');

function leds(data){
  var rgbs = require('../eModules/piModules/NodeLibrary/RGBModule')
  var sleep = require('sleep');

  rgbs.SetRGB(1,data.led1.color.r,data.led1.color.g,data.led1.color.b); // Purple
  rgbs.SetRGB(2,data.led2.color.r,data.led2.color.g,data.led2.color.b); // dark turquoise
  rgbs.SetRGB(3,data.led3.color.r,data.led3.color.g,data.led3.color.b); // Olive

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

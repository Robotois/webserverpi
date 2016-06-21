//var service = require('./controllers/service.js');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();

// var vm = require('vm');
var cluster = require('cluster');

// - Cluster configuration
cluster.setupMaster({
  exec : "tests/leds.js",
  args : process.argv.slice(2),
  silent : false
});

// middleware

app.use(logger());

app.use(route.get('/', home));
app.use(route.post('/post', show));

function *home() {
  this.body = 'Hello World';
}

function *show() {
  var data = yield parse(this);
  // console.log(sandbox);

  // var workerData = {script: data,
  //   modules: {
  //     leds: '../eModules/NodeLibrary/LEDsModule',
  //     buttons: '../eModules/NodeLibrary/ButtonModule'
  //   }
  // };

  //This will be fired when the forked process becomes online
  cluster.on( "online", function(worker) {
      var timer = 0;

      worker.on( "message", function(msg) {
          clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
          console.log(msg);
          worker.kill(); //Don't leave him hanging
      });
      // timer = setTimeout( function() {
      //     worker.process.kill(); //Give it 5 seconds to run, then abort it
      //     console.log("worker timed out");
      // }, 5000);

      // worker.send(workerData); //Send the code to run for the worker
  });

  setTimeout(()=>{
    for (var id in cluster.workers) {
      cluster.workers[id].kill();
    }
  },5000);
  cluster.fork();

  console.log("Executing script...");
   this.body = {success: true, message: 'exito!'};
}

// listen

app.listen(8082);
console.log('listening on port 8082');




// function leds(data){
//   var rgbs = require('../eModules/NodeLibrary/RGBModule')
//   var sleep = require('sleep');
//
//   rgbs.SetRGB(1,data.led1.color.r,data.led1.color.g,data.led1.color.b); // Purple
//   rgbs.SetRGB(2,data.led2.color.r,data.led2.color.g,data.led2.color.b); // dark turquoise
//   rgbs.SetRGB(3,data.led3.color.r,data.led3.color.g,data.led3.color.b); // Olive
//
//   setInterval(function(){
//     rgbs.SetRGB(1,data.led1.color.r,data.led1.color.g,data.led1.color.b);
//     console.log(data.led1.interval);
//     setTimeout(function () {
//       rgbs.ledOff(1);
//       console.log('apagar');
//     }, 1000);
//   }, data.led1.interval * 1000)
// }
//
// function distance(){
//   var dist = require('../eModules/NodeLibrary/DistanceModule');
//   var distModule = dist(1);
//
//   // setInterval(function () {
//     console.log("The current Distance is: "+distModule.Distance());
//   // },500);
// }

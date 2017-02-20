var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();
var child_process = require('child_process');
const resetTois  =  require('./resetTois');
const io = require('socket.io')();

var exec, env, light, led, temperature, lcd, rotatory, distance, button, ledRGB;

app.use(logger());

app.use(route.get('/', home));
app.use(route.post('/post', post));
app.use(route.post('/reset', reset));

function *home() {
  this.body = 'Hello World';
}

function *post() {
   var data = yield parse(this);
   if (!data.code) {
     return this.body =  {
       success: false,
       message: 'No code was provided'
     }
   }
   env = {
     data: JSON.stringify(data)
   };
   exec = child_process.exec('node codeRunner.js',
        { env: env },
        function (err, stdout, stderr) {
          if (err) {
            console.log(err.toString());
          } else if (stdout !== "") {
            io.emit('data', stdout);
            console.log(stdout);
          } else {
            console.log(stderr);
          }
        }
    );
   exec.stdout.pipe(process.stdout);
   // killl exec whe process ends
   process.on('exit', function () {
     exec.kill();
   });

   this.body = {
     success: true,
     message: 'exito!'
   };
}

function *reset() {
   var data = yield parse(this);
   exec.kill();
   resetTois(data);
   this.body = {
     success: true,
     message: 'exito!'
   };
}

// listen
app.listen(8082);
console.log('listening on port 8082');

io.on('connection', function(client){
  console.log('socket IO listening on port 8888');
});
io.listen(8888);

setInterval(function () {
  io.emit('data', {
    temperature: 32,
    light: 10
  });
});

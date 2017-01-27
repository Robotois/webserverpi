var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();
var spawn = require('child_process').spawn;
const resetTois  =  require('./resetTois');

var runCode, env, light, led, temperature, lcd, rotatory, distance, button, ledRGB;

app.use(logger());

app.use(route.get('/', home));
app.use(route.post('/post', show));
app.use(route.post('/reset', reset));

function *home() {
  this.body = 'Hello World';
}

function *show() {
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

   runCode = spawn('node', ['codeRunner.js'], { env: env });

   runCode.stdout.on('data', function (data) {
     console.log('stdout: ' + data.toString());
   });

   runCode.stderr.on('data', function (data) {
     console.log('stderr: ' + data.toString());
   });

   runCode.on('exit', function (code) {
     console.log('child process exited with code ' + code.toString());
   });
   /*exec = child_process.exec('node codeRunner.js',
        { env: env },
        function (err, stdout, stderr) {
          console.log('callback exec');
          if (err) {
            console.log(err.toString());
          } else if (stdout !== "") {
            console.log(stdout);
          } else {
            console.log(stderr);
          }
        }
    );*/
   // exec.stdout.pipe(process.stdout);
   // killl exec whe process ends
   process.on('exit', function () {
     runCode.kill();
   });

   this.body = {
     success: true,
     message: 'exito!'
   };
}

function *reset() {
   var data = yield parse(this);
   resetTois(data);
   this.body = {
     success: true,
     message: 'exito!'
   };
}

// listen
app.listen(8082);
console.log('listening on port 8082');

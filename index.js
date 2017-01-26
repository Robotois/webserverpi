var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();
var exec = require('child_process').exec;
var env, light, led, temperature, lcd, rotatory, distance, button, ledRGB;

app.use(logger());

app.use(route.get('/', home));
app.use(route.post('/post', show));

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
   exec('node codeRunner.js',
        { env: env },
        function (err, stdout, stderr) {
          if (err) {
          console.log(err.toString());
        } else if (stdout !== "") {
          console.log(stdout);
        } else {
          console.log(stderr);
        }
        }
    );
   setTimeout(function () {
     exec.kill();
   }, 10000);
   // killl exec whe process ends
   process.on('exit', function () {
     exec.kill();
   });
   this.body = {
     success: true,
     message: 'exito!'
   };
}

// listen
app.listen(8082);
console.log('listening on port 8082');

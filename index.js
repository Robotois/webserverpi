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
   console.log(data);
   if (!data.code) {
     return this.body =  {
       success: false,
       message: 'No code was provided'
     }
   }
   env = {
     data: data
   };
   exec('node codeRunner.js',
        { env: env },
        function (err, stdout, stderr) {
            if (err) {
                throw err;
            }
            console.log(stdout);
        }
    );
   this.body = {
     success: true,
     message: 'exito!'
   };
}

// listen
app.listen(8082);
console.log('listening on port 8082');

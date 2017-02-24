var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();
var spawn = require('child_process').spawn;
const io = require('socket.io')();

var runner, env;

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

   runner = spawn('node', ['codeRunner.js'], { env: env } );
   runner.stdout.on('data', (data) => {
      if (-1 === data.indexOf('Released')) {
        io.emit('data', data.toString());
      }
   });

   runner.stderr.on('data', (data) => {
      io.emit('error', data.toString());
   });

   runner.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
   });

   // killl exec whe process ends
   process.on('exit', function () {
     runner.kill();
   });

   this.body = {
     success: true,
     message: 'exito!'
   };
}

function *reset() {
   var data = yield parse(this);
   runner.kill();
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

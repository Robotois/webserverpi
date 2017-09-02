const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');

const app = koa();
// const spawn = require('child_process').spawn;
const cp = require('child_process');
const io = require('socket.io')();

let runner;
let env;

app.use(logger());
/* eslint-disable require-yield */

/**
 * Renders the home layout
 * @returns {HTML} returns html body.
 */
function* home() {
  this.body = 'Hello World';
}
/**
 * Renders the home layout
 * @returns {JSON} returns JSON.
 */
function* post() {
  const data = yield parse(this);
  // console.log(data);
  if (!data.code) {
    this.body = {
      success: false,
      message: 'No code was provided',
    };
    return this.body;
  }
  env = {
    data: JSON.stringify(data),
  };

  // runner = cp.spawn('node', ['codeRunner.js'], { env });
  runner = cp.fork(`${__dirname}/codeRunner.js`, [], { env, silent: true });
  runner.stdout.on('data', (stdout) => {
    console.log(stdout.toString());
    if (stdout.indexOf('Released') === -1) {
      io.emit('data', stdout.toString());
    }
  });

  runner.stderr.on('data', (stderr) => {
    console.log(stderr.toString());
    io.emit('stderr', stderr.toString());
  });

  runner.on('close', (code) => {
    /* eslint-disable no-console */
    console.log(`child process exited with code ${code}`);
  });

  // killl exec whe process ends
  process.on('exit', () => {
    runner.kill('SIGTERM');
  });

  this.body = {
    success: true,
    message: 'exito!',
  };
  return this.body;
}
/**
 * Renders the home layout
 * @returns {JSON} returns JSON.
 */
function* reset() {
  runner.kill('SIGTERM');
  this.body = {
    success: true,
    message: 'exito!',
  };
}

app.use(route.get('/', home));
app.use(route.post('/post', post));
app.use(route.post('/reset', reset));

// listen
app.listen(8082);
console.log('listening on port 8082');

io.on('connection', () => {
  console.log('socket IO listening on port 8888');
});
io.listen(8888);


const mosca = require('mosca');
const redis = require('redis');

const ascoltatore = {
  type: 'redis',
  redis,
  db: 12,
  port: 6379,
  return_buffers: true, // to handle binary payloads
  host: 'localhost',
};

const moscaSettings = {
  port: 1883,
  http: {
    port: 1884,
    bundle: true,
    static: './',
  },
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Redis,
  },
};

const setup = () => {
  console.log('Mosca server is up and running');
};

const server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', (packet, client) => {
  console.log('Published', packet.topic, packet.payload);
});

// fired when the mqtt server is ready

// const data = yield parse(this);
// // console.log(data);
// if (!data.code) {
//   this.body = {
//     success: false,
//     message: 'No code was provided',
//   };
//   return this.body;
// }
// env = {
//   data: JSON.stringify(data),
// };
// const n = cp.fork(`${__dirname}/codeRunnerTest.js`, [], { env });
//
// n.on('message', (m) => {
//   console.log('PARENT got message:', m);
// });
//
// n.send({ hello: 'world' });

const Express = require('express');
const logger = require('morgan');
const runnerRoutes = require('./routes/runner-routes');
const wifiRoutes = require('./routes/wifi-routes');
const resetButton = require('../robotois-reset');
const command = require('../robotois-reset/commands');

resetButton.init();

const app = new Express();

app.use(logger('tiny'));
app.use('/wifi', wifiRoutes);
app.use('/runner', runnerRoutes);

app.get('/shutdown', (req, res) => {
  console.log('---> Robotois system going to shutdown...');
  command('sudo shutdown -h now');
  res.status(200).json({
    ok: 'ok',
  });
});

// listen
app.listen(8082);
console.log('listening on port 8082');

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

// server.on('unsubscribed', (params) => {
//   console.log('client unsubscribed:', params);
// })

// fired when a message is received
// server.on('published', (packet, client) => {
//   console.log('Published', packet.topic, packet.payload.toString());
// });

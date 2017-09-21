import path from 'path';
import Express from 'express';
import logger from 'morgan';
import io from 'socket.io';
import React from 'react';
import ReactDOM from 'react-dom/server';

import template from '../ui/template';
import AppContainer from '../ui/containers/AppContainer';
import runnerRoutes from './routes/runner-routes';
import wifiRoutes from './routes/wifi-routes';
import resetButton from '../robotois-reset';
import command from '../robotois-reset/commands';

resetButton.init();

const app = new Express();
const socketIO = io();

const home = (req, res) => {
  // const allWifis = wifis.getAll();
  // console.log(allWifis);
  const appBody = ReactDOM.renderToString(<AppContainer />);
  res.send(template(appBody));
};

app.use(logger('tiny'));
app.use('/static', Express.static(path.join(__dirname, '../ui/dist')));
app.get('/', home);
// app.get('/hostname', getHostname);
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

socketIO.on('connection', () => {
  console.log('socket IO listening on port 8888');
});
socketIO.listen(8888);

// const mosca = require('mosca');
// const redis = require('redis');
//
// const ascoltatore = {
//   type: 'redis',
//   redis,
//   db: 12,
//   port: 6379,
//   return_buffers: true, // to handle binary payloads
//   host: 'localhost',
// };
//
// const moscaSettings = {
//   port: 1883,
//   http: {
//     port: 1884,
//     bundle: true,
//     static: './',
//   },
//   backend: ascoltatore,
//   persistence: {
//     factory: mosca.persistence.Redis,
//   },
// };
//
// const setup = () => {
//   console.log('Mosca server is up and running');
// };
//
// const server = new mosca.Server(moscaSettings);
// server.on('ready', setup);
//
// server.on('clientConnected', (client) => {
//   console.log('client connected', client.id);
// });
//
// // fired when a message is received
// server.on('published', (packet, client) => {
//   console.log('Published', packet.topic, packet.payload);
// });

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

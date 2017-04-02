const logger = require('koa-logger');
const route = require('koa-route');
const koa = require('koa');
const config = require('./config.json');
const iwList = require('./lib/iwList');

module.exports = function App() {
  const app = koa();

  app.use(logger());

  /* eslint-disable require-yield */
  function* listWifis() {
    this.body = yield new Promise((resolve, reject) => {
      iwList((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result[0].scan_results);
        }
      });
    });
  }
  app.use(route.post('/list-wifis', listWifis));

  // listen
  app.listen(config.server.port);
  console.log('listening on port 8082');
};

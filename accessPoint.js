const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');
const config = require('./config.json');

module.exports = function App() {
  const app = koa();

  app.use(logger());
  /**
 * It returns the a list of wifis
 * @returns {JSON} the list of wifis
 */
  function* listWifis() {
    const data = yield parse(this);
    this.body = {
      message: 'listWifis',
      data,
    };
  }
  app.use(route.post('/list-wifis', listWifis));
  /**
   * It sets wifi credentials
   * @returns {JSON} response object
   */
  function* enableWifi() {
    const data = yield parse(this);
    this.body = data;
  }
  app.use(route.post('/enable-wifi', enableWifi));

  // listen
  app.listen(config.server.port);
  /* eslint-disable no-console */
  console.log(`listening on port ${config.server.port}`);
};

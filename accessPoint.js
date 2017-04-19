const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');
const config = require('./config.json');
const iwlist = require('wireless-tools/iwlist');
const setup = require('setup')();
const wpaSupplicant = require('wireless-tools/wpa_supplicant');
const setHostName = require('./lib/hostname');

module.exports = function App() {
  const app = koa();

  app.use(logger());
  /**
 * It returns the a list of wifis
 * @returns {JSON} the list of wifis
 */
  function* listWifis() {
    this.body = yield new Promise((resolve, reject) => {
      iwlist.scan('wlan0', (error, networks) => {
        if (error) {
          reject(error);
        } else {
          resolve(networks);
        }
      });
    });
  }
  app.use(route.post('/list-wifis', listWifis));
  app.use(route.get('/list-wifis', listWifis));
  /**
   * It sets wifi credentials
   * @returns {JSON} response object
   */
  function* enableWifi() {
    const data = yield parse(this);
    const options = {
      interface: 'wlan0',
      ssid: data.ssid,
      passphrase: data.passcode,
      driver: 'nl80211'
    };

    this.body = yield new Promise((resolve, reject) => {
      wpaSupplicant.enable(options, (err) => {
        if (err) {
          reject(err);
        } else {
          setHostName(data.hostname || 'robotois01', resolve);
          // we need to reboot to set new host name;
          resolve();
        }
      });
    });
  }
  app.use(route.post('/enable-wifi', enableWifi));

  // listen
  app.listen(config.server.port);
  /* eslint-disable no-console */
  console.log(`listening on port ${config.server.port}`);
};

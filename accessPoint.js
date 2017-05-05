const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');
const config = require('./config.json');
const iwlist = require('wireless-tools/iwlist');
const wpaSupplicant = require('wireless-tools/wpa_supplicant');
const setHostName = require('./lib/hostname');
const exec = require('child_process').exec;

const MAX_WAIT_TIME = 20000;

const exitIfReady = function exitIfReady(hostname) {
  let newIP;
  exec('hostname -I', (err2, output) => {
    newIP = output.trimRight();
    newIP = newIP.split(' ');
    if (newIP.length > 1) {
      setHostName(hostname || 'robotois01');
    }
  });
};


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
      wpaSupplicant.enable(options, (error) => {
        if (error) {
          reject(error);
        } else {
          exec('ifdown wlan0 && sleep 1 && ifup wlan0', (err2) => {
            if (err2) {
              reject(err2);
            } else {
              // Every 2 seconds, check to see if it succeeded
              for (let k = 2000; k < MAX_WAIT_TIME; k += 2000) {
                setTimeout(
                  () => {
                    exitIfReady(data.hostname);
                  },
                  k
                );
              }

              setTimeout(
                () => {
                  console.error('Unable to get an IP address');
                  reject('Unable to get an IP address');
                },
                MAX_WAIT_TIME
              );
            }
          });
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

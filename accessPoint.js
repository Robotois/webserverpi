const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');
const config = require('./config.json');
const iwlist = require('wireless-tools/iwlist');
const setHostName = require('./lib/hostname');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const MAX_WAIT_TIME = 20000;
const SUPPLICANT_PATH = path.join('/etc', 'wpa_supplicant', 'wpa_supplicant.conf');

const exitIfReady = function exitIfReady(hostname) {
  let newIP;
  exec('hostname -I', (err2, output) => {
    newIP = output.trimRight();
    newIP = newIP.split(' ');
    if (newIP.length) {
      setHostName(hostname || 'robotois01');
    }
  });
};

const getHeadOfConf = function getHeadOfConf(filePath) {
  return fs.readFileSync(filePath).toString().replace(/network(.|\n)*$/, '');
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

    this.body = yield new Promise((resolve, reject) => {
      const templateConf = getHeadOfConf(SUPPLICANT_PATH);
      const networkString = `network={\n
          \tssid="${data.ssid}"\n
          \tpsk="${data.passcode}"\n
        }\n`;

      fs.writeFileSync(SUPPLICANT_PATH, templateConf + networkString);

      console.log('Restarting network connection');
      exec('ifdown wlan0 && sleep 1 && ifup wlan0', (err) => {
        if (err) {
          console.error(err);
          reject(err);
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
    });
  }
  app.use(route.post('/enable-wifi', enableWifi));

  // listen
  app.listen(config.server.port);
  /* eslint-disable no-console */
  console.log(`listening on port ${config.server.port}`);
};

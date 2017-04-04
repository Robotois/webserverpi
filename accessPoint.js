const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');
const config = require('./config.json');
const iwList = require('./lib/iwList');

module.exports = function App(wifiManager) {
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

  function* enableWifi() {
    const data = yield parse(this);
    const connInfo = {
      wifi_ssid: data.ssid,
      wifi_passcode: data.passcode,
      ip_addr: '192.168.0.88',
    };
    console.log(connInfo);
    // TODO: If wifi did not come up correctly, it should fail
    // currently we ignore ifup failures.
    this.body = yield new Promise((resolve, reject) => {
      wifiManager.enable_wifi_mode(connInfo, (error) => {
        if (error) {
          console.log(`Enable Wifi ERROR: ${error}`);
          console.log('Attempt to re-enable AP mode');
          wifiManager.enable_ap_mode(config.access_point.ssid, (error2) => {
            console.log(error2);
            console.log('... AP mode reset');
          });
          reject(error);
        } else {
          console.log('Wifi Enabled! - Exiting');
          resolve({
            success: true,
            message: 'Wifi Enabled! - Exiting',
          });
        }
      });
    });
  }
  app.use(route.post('/enable-wifi', enableWifi));

  // listen
  app.listen(config.server.port);
  console.log('listening on port 8082');
};

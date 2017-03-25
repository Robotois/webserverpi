const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');
const config = require('./config.json');
const iwList = require('./lib/iwList');

module.exports = function App(wifiManager) {
  const app = koa();

  app.use(logger());

  function* enableWifi() {
    const data = yield parse(this);
    const connInfo = {
      wifi_ssid: data.wifi_ssid,
      wifi_passcode: data.wifi_passcode,
    };

    // TODO: If wifi did not come up correctly, it should fail
    // currently we ignore ifup failures.
    wifiManager.enable_wifi_mode(connInfo, (error) => {
      if (error) {
        console.log(`Enable Wifi ERROR: ${error}`);
        console.log('Attempt to re-enable AP mode');
        wifiManager.enable_ap_mode(config.access_point.ssid, (error2) => {
          console.log(error2);
          console.log('... AP mode reset');
        });
        // response.redirect('/');
        this.body = {
          success: false,
          message: error,
        };
        return this.body;
      }
      this.body = {
        success: true,
        message: 'Wifi Enabled! - Exiting',
      };
      // Success! - exit
      console.log('Wifi Enabled! - Exiting');
      return this.body;
    });
  }
  /* eslint-disable require-yield */
  function* listWifis() {
    console.log('Server got /rescan_wifi');
    this.body = yield new Promise((resolve, reject) => {
      iwList((error, result) => {
        console.log(JSON.stringify(result, null, '\t'));
        if (error) {
          reject(error);
        } else {
          resolve(result[0].scan_results);
        }
      });
    });
  }
  app.use(route.post('/enable-wifi', enableWifi));
  app.use(route.get('/list-wifis', listWifis));

  // listen
  app.listen(config.server.port);
  console.log('listening on port 8082');
};

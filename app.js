const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');
const config = require('./config.json');
const io = require('socket.io')();
const spawn = require('child_process').spawn;
const iwlist = require('./lib/iwList');

module.exports = function App(wifiManager) {
  let runner;
  let env;
  const app = koa();

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

    runner = spawn('node', ['codeRunner.js'], { env });
    runner.stdout.on('data', (stdout) => {
      if (stdout.indexOf('Released') === -1) {
        io.emit('data', stdout.toString());
      }
    });

    runner.stderr.on('data', (stderr) => {
      io.emit('stderr', stderr.toString());
    });

    runner.on('close', (code) => {
      /* eslint-disable no-console */
      console.log(`child process exited with code ${code}`);
    });

    // killl exec whe process ends
    process.on('exit', () => {
      runner.kill();
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
    runner.kill();
    this.body = {
      success: true,
      message: 'exito!',
    };
  }
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
  function* rescanWifi() {
    console.log('Server got /rescan_wifi');
    iwlist((error, result) => {
      console.log(result);
    });
  }
  app.use(route.get('/', home));
  app.use(route.post('/post', post));
  app.use(route.post('/reset', reset));
  app.use(route.post('/enable-wifi', enableWifi));
  app.user(route.post('/rescan-wifi', rescanWifi));

  // listen
  app.listen(8082);
  console.log('listening on port 8082');

  io.on('connection', () => {
    console.log('socket IO listening on port 8888');
  });
  io.listen(8888);
};

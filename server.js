const hostapd = require('wireless-tools/hostapd');
const dependencyManager = require('./lib/dependencyManager')();
const async = require('async');
const os = require('os');

const config = require('./config.json');

async.series(
  [
    // 1. Check if we have the required dependencies installed
    function checkDeps(done) {
      dependencyManager.checkDeps(
        {
          binaries: ['dhcpd', 'hostapd', 'iw'],
          files: ['/etc/init.d/isc-dhcp-server'],
        },
        (error) => {
          if (error) {
            console.log(' * Dependency error, did you run `sudo npm run-script provision`?');
          }
          done(error);
        }
      );
    },

    // 2.- if we are calling it from the reset button
    function forceRestartAp(done) {
      if (process.argv[2] === '--ap') {
        return done(true);
      }
      return done();
    },

    // 2. Check if we need to configure for first time
    function checkIfKitIsReady(done) {
      console.log(os.hostname());
      return done('Error gacho camacho');
    },

    // 3. Start the webserver to configure the kit
    function startServer(done) {
      require('./index.js')(done); // eslint-disable-line
    },
  ],
  (error) => {
    if (error === true) {
      // we need to set up the AP
      async.series(
        [
          // Turn RPI into an access point
          function enableAP(done) {
            hostapd.enable(config.accessPoint, (err) => {
              console.log(err || 'AP created'); // eslint-disable-line
              done(err);
            });
          },
          // Host HTTP server while functioning as AP, the "api.js"
          function startServer() {
            require('./accessPoint.js')(); // eslint-disable-line
          },
        ],
        (error1) => {
          console.log(`ERROR: ${error1}`); // eslint-disable-line
        }
      );
    } else {
      console.log(`ERROR: ${error}`);
    }
  }
);

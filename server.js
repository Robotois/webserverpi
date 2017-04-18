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
          files: ['/etc/init.d/isc-dhcp-server']
        },
        function (error) {
          if (error) {
            console.log(' * Dependency error, did you run `sudo npm run-script provision`?');
          }
          done(error);
        }
      );
    }
  ],
  function (error) {
    console.log(`ERROR: ${error}`);
  }
);

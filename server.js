/*eslint-disable*/
var async = require("async"),
    wifiManager = require("./lib/wifiManager")(),
    dependencyManager = require("./lib/dependencyManager")(),
    config = require("./config.json");

async.series([
    // 1. Check if we have the required dependencies installed
    function test_deps(done) {
        dependencyManager.check_deps({
            "binaries": ["dhcpd", "hostapd", "iw"],
            "files":    ["/etc/init.d/isc-dhcp-server"]
        }, function(error) {
            if (error) console.log(" * Dependency error, did you run `sudo npm run-script provision`?");
            done(error);
        });
    },
    // if we are calling it from the reset button
    function forceRestartAp(done) {
        if (process.argv[2] === '--ap') {
          console.log(process.argv[2]);
          return done(true);
        }
        return done();
    },

    // 2. Check if wifi is enabled / connected
    function test_is_wifi_enabled(done) {
        wifiManager.is_wifi_enabled(function(error, result_ip) {
            if (result_ip) {
                console.log("\nWifi is enabled, and IP " + result_ip + " assigned");
            } else {
                console.log("\nWifi is not enabled, Enabling AP for self-configure");
                return done(true);
            }
            done(error);
        });
    },

    // Host HTTP server while functioning as AP, the "api.js"
    function start_http_server(done) {
        require("./app.js")(wifiManager, done);
    },
], function(error) {
    if (error === true) { // we need to set up the AP
      async.series([
        // Turn RPI into an access point
        function enable_rpi_ap(done) {
            wifiManager.enable_ap_mode(config.access_point.ssid, function(error) {
                if(error) {
                    console.log("... AP Enable ERROR: " + error);
                } else {
                    console.log("... AP Enable Success!");
                }
                done(error);
            });
        },
        // Host HTTP server while functioning as AP, the "api.js"
        function start_http_server(done) {
            require("./accessPoint.js")(wifiManager, done);
        },
      ], function (error) {
        console.log("ERROR: " + error);
      });
    } else {
      console.log("ERROR: " + error);
    }
});

const wpaSupplicant = require('wireless-tools/wpa_supplicant');
const exec = require('child_process').exec;

const MAX_WAIT_TIME = 20000;
const exitIfReady = function exitIfReady() {
  let newIP;
  exec('hostname -I', (err2, output) => {
    console.log(output);
    newIP = output.trimRight();
    newIP = newIP.split(' ');
    if (newIP.length > 1) {
      console.log('wifi ready!!!!!');
      process.exit(0);
    }
  });
};

const options = {
  interface: 'wlan0',
  ssid: 'ARRIS-3882',
  passphrase: '11A10DA43FCEBC11',
  driver: 'nl80211'
};

wpaSupplicant.enable(options, (error) => {
  console.log(arguments);
  if (error) {
    console.log(error);
  } else {
    exec('ifdown wlan0 && sleep 1 && ifup wlan0', (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      } else {
        // Every 2 seconds, check to see if it succeeded
        for (let k = 2000; k < MAX_WAIT_TIME; k += 2000) {
          setTimeout(
            () => {
              exitIfReady();
            },
            k
          );
        }

        setTimeout(
          () => {
            console.error('Unable to get an IP address');
            process.exit(1);
          },
          MAX_WAIT_TIME
        );
      }
    });
  }
});

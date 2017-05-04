const wpaSupplicant = require('wireless-tools/wpa_supplicant');
const exec = require('child_process').exec;

const MAX_WAIT_TIME = 20000;
const exitIfReady = function exitIfReady() {
  exec('hostname -I', (err2, output) => {
    if (output.trimRight()) {
      // Exit as soon as this succeeds
      console.log(output);
      console.log(output.trimRight());
      process.exit(0);
    }
  });
};

const options = {
  interface: 'wlan0',
  ssid: 'ARRIS-3882',
  passphrase: '11A10DA43FCEBC1188 ',
  driver: 'nl80211'
};

wpaSupplicant.enable(options, (error) => {
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

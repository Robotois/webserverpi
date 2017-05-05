const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const SUPPLICANT_PATH = path.join('/etc', 'wpa_supplicant', 'wpa_supplicant.conf');

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

function getHeadOfConf(filePath) {
  return fs.readFileSync(filePath).toString().replace(/network(.|\n)*$/, '');
}

const options = {
  interface: 'wlan0',
  ssid: 'ARRIS-3882',
  passphrase: '11A10DA43FCEBC1188',
  driver: 'nl80211'
};

const templateConf = getHeadOfConf(SUPPLICANT_PATH);
// templateConf = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1`;
const networkString = `network={\n
    \tssid="${options.ssid}"\n
    \tpsk="${options.passphrase}"\n
  }\n`;

console.log(templateConf);
console.log(networkString);
fs.writeFileSync(SUPPLICANT_PATH, templateConf + networkString);

console.log('Restarting network connection');
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

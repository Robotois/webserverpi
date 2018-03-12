const { Gpio } = require('onoff');
const wifiConfig = require('robotois-wifi-config');
const command = require('./commands');

const button = new Gpio(4, 'in', 'both');

let hrstart;
let hrend;

const resetFunction = (seconds, ms) => {
  switch (true) {
    case seconds >= 3:
      console.log('---> Robotois enable Access Point...');
      wifiConfig.startAP();
      break;
    case seconds <= 1 && (ms / 1000000) >= 150:
      console.log('---> Robotois system going to shutdown...');
      command('sudo shutdown -h now');
      break;
    default:
  }
};

exports.init = () => {
  button.watch((err, value) => {
    if (err) {
      throw err;
    }

    if (value === 1) {
      hrstart = process.hrtime();
    } else {
      hrend = process.hrtime(hrstart);
      resetFunction(hrend[0], hrend[1]);
      hrstart = undefined;
      hrend = undefined;
      // console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
    }
  });
};

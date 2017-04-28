const WiFiControl = require('wifi-control');

const settings = {
  debug: true,
  iface: 'wlan0',
  connectionTimeout: 10000 // in ms
};

WiFiControl.configure(settings);
WiFiControl.init({ debug: true });
WiFiControl.connectToAP(
  {
    ssid: 'ARRIS-3882',
    passphrase: '11A10DA43FCEBC11'
  },
  (err, response) => {
    if (err) {
      console.log(err);
    }
    console.log(response);
  }
);

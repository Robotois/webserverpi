const WiFiControl = require('wifi-control');

const settings = {
  debug: true,
  iface: 'wlan0',
  connectionTimeout: 10000 // in ms
};

WiFiControl.configure(settings);
WiFiControl.connectToAP(
  {
    ssid: 'ARRIS-3882',
    passphrase: '12344566456'
  },
  (err, response) => {
    if (err) {
      console.log(err);
    }
    console.log(response);
  }
);

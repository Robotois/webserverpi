const WiFiControl = require('wifi-control');

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

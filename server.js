const hostapd = require('wireless-tools/hostapd');

const options = {
  channel: 6,
  driver: 'nl80211',
  hw_mode: 'g',
  interface: 'wlan0',
  ssid: 'ROBOTOIS-KIT',
  wpa: 2,
  wpa_passphrase: 'robotois',
};

hostapd.enable(options, (err) => {
  // the access point was created
  console.log(err || 'AP created');
});

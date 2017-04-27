const wpaSupplicant = require('wireless-tools/wpa_supplicant');

const options = {
  interface: 'wlan0',
  ssid: 'ARRIS-3882',
  passphrase: '12344566456',
  driver: 'nl80211'
};
wpaSupplicant.enable(options, (err) => {
  console.log(arguments);
  console.log(err);
});

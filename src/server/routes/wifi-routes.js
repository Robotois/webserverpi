const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const { connectWifi, startAP } = require('wifi-config');
const iwlist = require('wireless-tools/iwlist');
const command = require('../../robotois-reset/commands');

const router = express.Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/all', (req, res) => {
  iwlist.scan('wlan0', (err, networks) => {
    if (err) {
      console.error(err);
      res.status(404).json({
        message: 'Error reading wifis',
      });
      return;
    }
    // console.log('iwlist all:', networks);
    res.status(200).json({
      networks,
    });
  });
});

router.post('/connect', (req, res) => {
  // const { id } = req.params;
  const { ssid, pwd } = req.body;
  console.log(req.body);
  connectWifi(ssid, pwd);
  res.status(200).json({
    ok: true,
  });
  setTimeout(() => {
    command('sudo shutdown -r now');
  }, 500);
});

router.get('/hostname', (req, res) => {
  const hostname = os.hostname();
  res.status(200).json({
    hostname,
  });
});

router.get('/start-ap', (req, res) => {
  startAP();
  // const hostname = os.hostname();
  res.status(200).json({
    ok: 'ok',
  });
});

module.exports = router;

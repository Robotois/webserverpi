import express from 'express';
import bodyParser from 'body-parser';
import wifiConfig from 'wifi-config';
import iwlist from 'wireless-tools/iwlist';

const wifis = wifiConfig.wifis;
const router = express.Router();

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
  console.log(req.params);
  res.status(200).json({
    good: 'good',
  });
  // if (settings) {
  // } else {
  //   res.status(404).json({
  //     message: `Unknown wifi with id: ${id}`,
  //   });
  // }
});

module.exports = router;

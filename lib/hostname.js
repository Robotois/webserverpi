const fs = require('fs');
const exec = require('child_process').exec;

exports.setHostName = function setHostName(hostname, cb) {
  fs.writeFile('/etc/hostname', hostname, () => {
    exec('reboot', () => {
      console.log('Reinicando el kit ... '); // eslint-disable-line
      cb();
    });
  });
};

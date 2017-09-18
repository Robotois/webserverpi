const { execSync } = require('child_process');

const execute = (command) => {
  execSync(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error [${command}]: ${error}`);
      return;
    }
    console.log(`stdout [${command}]: ${stdout}`);
    console.log(`stderr [${command}]: ${stderr}`);
  });
};

module.exports = execute;

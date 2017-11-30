const Express = require('express');
const bodyParser = require('body-parser');
const cp = require('child_process');

const router = Express.Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let runner = null;
let runnerError;

const killRunner = () => {
  if (runner !== null) {
    runner.kill('SIGTERM');
    runner = null;
  } else {
    console.log('codeRunner is dead already...');
  }
};

const runCode = (req, res) => {
  const data = req.body;
  if (runner !== null) {
    runner.kill('SIGTERM');
    runner = null;
  }
  // if (!data.code) {
  //   res.status(500).json({
  //     success: false,
  //     message: 'No hay codigo a ejecutar!!',
  //   });
  //   return;
  // }
  const env = {
    data: JSON.stringify(data),
    mqttHost: 'localhost',
  };
  // console.log(env.data);

  runner = cp.fork(`${__dirname}/../codeRunner.js`, [], { env, silent: true });
  runnerError = undefined;
  runner.stdout.on('data', (stdout) => {
    console.log(stdout.toString());
  });

  runner.stderr.on('data', (stderr) => {
    runnerError = stderr.toString();
    console.log(runnerError);
  });

  process.on('exit', killRunner);

  // console.log('runCode: ', req.body);
  res.status(200).json({
    success: true,
    message: 'Kit en Ejecucion',
    runner: true,
  });
};

const stopRunner = (req, res) => {
  killRunner();
  res.status(200).json({
    success: true,
    message: 'Ejecucion finalizada',
    runner: false,
  });
};

const status = (req, res) => {
  if (runner !== null) {
    res.status(200).json({
      success: true,
      message: runnerError || 'Kit en Ejecucion',
      runner: true,
    });
  } else {
    res.status(200).json({
      success: true,
      message: runnerError || 'Kit Conectado y en Espera',
      runner: false,
    });
  }
};

router.post('/', runCode);
router.post('/stop', stopRunner);
router.get('/status', status);

module.exports = router;

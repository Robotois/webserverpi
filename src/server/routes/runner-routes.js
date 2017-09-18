import Express from 'express';
import bodyParser from 'body-parser';
import cp from 'child_process';

const router = Express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let runner = null;
const killRunner = () => {
  if (runner) {
    runner.kill('SIGTERM');
  } else {
    console.log('codeRunner is dead already...');
  }
};

const runCode = (req, res) => {
  const data = req.body;
  if (!data.code) {
    res.status(500).json({
      success: false,
      message: 'No hay codigo a ejecutar!!',
    });
    return;
  }
  const env = {
    data: JSON.stringify(data),
  };

  runner = cp.fork(`${__dirname}/codeRunner.js`, [], { env, silent: true });
  runner.stdout.on('data', (stdout) => {
    console.log(stdout.toString());
  });

  runner.stderr.on('data', (stderr) => {
    console.log(stderr.toString());
  });

  runner.on('exit', (code) => {
    runner = null;
    console.log('coderRunner is dead: ', code);
  });

  process.on('exit', killRunner);

  // console.log('runCode: ', req.body);
  res.status(200).json({
    success: true,
    message: 'Configuracion Exitosa',
  });
};

const stopRunner = (req, res) => {
  killRunner();
  res.status(200).json({
    success: true,
    message: 'Ejecucion finalizada',
  });
};

router.post('/', runCode);
router.post('/stop', stopRunner);

module.exports = router;

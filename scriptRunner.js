// //The runner.js is ran in a separate process and just listens for the message which contains code to be executed
// process.on('message', function( UNKNOWN_CODE) {
//   var requiredModules = {};
//
//   for(item in UNKNOWN_CODE.modules){
//     // console.log(UNKNOWN_CODE.modules[item]);
//     requiredModules[item] = require(UNKNOWN_CODE.modules[item]);
//   }
//
//   // UNKNOWN_CODE.modules.forEach(function(item){
//   //   requiredModules[item] = require(modulesPath[item]);
//   // });
//   // console.log(requiredModules);
//
//     var vm = require("vm");
//     var ctx = vm.createContext(requiredModules);
//     var script = vm.createScript(UNKNOWN_CODE.script);
//     script.runInNewContext(ctx);
//
//     process.send( "finished" ); //Send the finished message to the parent process
// });
//
// process.on('SIGINT', () => {
//   console.log('Received SIGINT.  Press Control-D to exit.');
// });
//
// process.on('exit', (code) => {
//   console.log(`About to exit with code: ${code}`);
// });

process.on('SIGINT', () => {
  console.log('Received SIGINT.  Press Control-D to exit.');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM.  Press Control-D to exit.');
  process.exit();
});

var i = 0;
function compute() {
    if (i < 1000000000) {
      if((i % 5000) == 0){
        console.log('Current count: ' + i);
      }
        // perform some computation
        i++;
        setImmediate(compute);
    }
}
compute();
console.log("compute() still working…");

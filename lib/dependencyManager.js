const _ = require('underscore')._;
const async = require('async');
const fs = require('fs');
const exec = require('child_process').exec;

module.exports = function dependencyManager() {
  // Check dependencies based on the input "deps" object.
  // deps will contain: {"binaries": [...], "files":[...]}
  const checkDeps = function checkDeps(deps, callback) {
    if (typeof deps.binaries === 'undefined') {
      deps.binaries = []; // eslint-disable-line no-param-reassign
    }
    if (typeof deps.files === 'undefined') {
      deps.files = []; // eslint-disable-line no-param-reassign
    }

    // Define functions to check our binary deps
    const checkExeFns = _.map(deps.binaries, binDep =>
      // console.log("Building || function for " + binDep);
       function fun(callback2) {
         exec(`which ${binDep}`, (error, stdout) => {
           if (error) {
             return callback2(error);
           }
           if (stdout === '') {
             return callback2(`"which ${binDep}" returned no valid binary`);
           }
           return callback2(null);
         });
       });

    // Define functions to check our file deps
    var checkFileFns = _.map(deps.files, file =>
      // console.log("Building || function for " + file);
       function (callback3) {
         fs.exists(file, (exists) => {
           if (exists) return callback3(null);
           return callback3(`${file} does not exist`);
         });
       });

    // Dispatch the parallel functions
    async.series(
      [
        function checkBinaries(nextStep) {
          async.parallel(checkExeFns, nextStep);
        },
        function checkFiles(nextStep) {
          async.parallel(checkFileFns, nextStep);
        },
      ],
      callback,
    );
  };

  return {
    checkDeps: checkDeps,
  };
};

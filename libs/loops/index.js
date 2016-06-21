var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function loops() {
  EventEmitter.call(this);
};

loops.prototype.while = function (stopCond,whileBody,whileName){
  var self = this;

  function run(){
    if(stopCond()){
      whileBody();
      setImmediate(run);
    }else {
      // console.log(whileName ? true : false);
      if(whileName){
        self.emit(whileName+'_end');
      }
    }
  };

  run();
};

loops.prototype.for = function (initVal,endVal,forBody,forName) {
  this.index = initVal
  var self = this;

  function run(){
    if(self.index < endVal){
        forBody(self.index);
        self.index = self.index +1;
        setImmediate(run);
    }else {
      if(forName){
        self.emit(forName+'_end');
      }
    }
  };
  
  run();
};

// ---- callback hell risk...
// loops.prototype.while = function (stopCond,whileBody,nextFunc){
//   function run(){
//     if(stopCond()){
//       whileBody();
//       setImmediate(run);
//     }else {
//       nextFunc();
//     }
//   };
//   run();
// };
// loops.prototype.for = function (initVal,endVal,forBody,nextFunc) {
//   this.index = initVal
//   var _self = this;
//
//   function run(){
//     if(_self.index < endVal){
//         forBody(_self.index);
//         _self.index = _self.index +1;
//         setImmediate(run);
//     }else {
//       nextFunc();
//     }
//   };
//   run();
// };

inherits(loops,EventEmitter);

module.exports = loops;

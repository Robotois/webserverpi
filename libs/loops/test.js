var _loops = require('./index.js');
loops = new _loops();

/***
var count = 1;
while (count <= 10) {
  console.log('Count: ' + count);
  count = count + 1;
}

console.log('While ended...');
***/

var count = 1;
function stopCond(){
  return count <= 10;
};

function body(){
  console.log('Count: ' + count);
  count = count + 1;
}

loops.while(stopCond,body,'while1');

/***
for(var idx = 0; idx < 10; idx++){
   console.log('Current Idx: ' + idx);
}
***/

// loops.on('while1_end',function(){
//   console.log('while ended');
//   loops.for(0,10,function (idx){
//     console.log('Current Idx: ' + idx);
//   },'for1');
// });
//
// loops.on('for1_end',()=>{
//   console.log('for ended...');
// });

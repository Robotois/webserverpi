var _loops = require('../libs/loops'),
    loops = new _loops(),
    sleep = require('sleep'),
    _motors = require('../externals/eModules/NodeLibrary/MotorsModule'),
    motors = new _motors();

// var _rotary = require('../externals/eModules/NodeLibrary/RotaryModule'),
//   rotary = new _rotary(1);

var _buttons = require('../externals/eModules/NodeLibrary/ButtonModule'),
  buttons = new _buttons(1);

var _lcd = require('../externals/eModules/NodeLibrary/LCDModule'),
  lcd = new _lcd();

/** Basic test
// motors.LeftMotorPWM(200);
// sleep.sleep(2);
// motors.LeftMotorPWM(400);
// sleep.sleep(2);
// motors.LeftMotorPWM(600);
// sleep.sleep(2);
// motors.LeftMotorPWM(400);
// sleep.sleep(2);
// motors.LeftMotorPWM(200);
// sleep.sleep(2);
// motors.LeftMotorStop();
// sleep.sleep(2);
// motors.LeftMotorPWM(-200);
// sleep.sleep(2);
// motors.LeftMotorPWM(-400);
// sleep.sleep(2);
// motors.LeftMotorPWM(-600);
// sleep.sleep(2);
// motors.LeftMotorPWM(-400);
// sleep.sleep(2);
// motors.LeftMotorPWM(-200);
// sleep.sleep(2);
// motors.LeftMotorStop();
**/

/** Rotary test**/
// lcd.Message('Welcome to\nRobotois :D');
// sleep.sleep(3);
// lcd.Clear();
//
// var currentValue = rotary.ScaledValue(),
//   prevValue = currentValue;
// lcd.Message("Value: " + currentValue);
//
// loops.forever(()=>{
//   currentValue = rotary.ScaledValue();
//   if(prevValue != currentValue){
//     motors.LeftMotorPWM(currentValue-512);
//     lcd.SetCursor(1,8);
//     lcd.Message( ("    " + (currentValue-512)).slice(-4) );
//     prevValue = currentValue;
//   }
// });

/** Drive PWM Test **/
// lcd.Message('Welcome to\nRobotois :D');
// sleep.sleep(3);
// lcd.Clear();
//
// var currentValue = rotary.ScaledValue(),
//   prevValue = currentValue;
// lcd.Message("Value: " + currentValue);
//
// loops.forever(()=>{
//   currentValue = rotary.ScaledValue();
//   if(prevValue != currentValue){
//     motors.DrivePWM(currentValue-512,currentValue-512);
//     lcd.SetCursor(1,8);
//     lcd.Message( ("    " + (currentValue-512)).slice(-4) );
//     prevValue = currentValue;
//   }
// });
//

/** Button Test **/
lcd.Message('Welcome to\nRobotois :D');
sleep.sleep(3);
lcd.Clear();

var currentSpeed = 0;
lcd.Message("Speed: " + currentSpeed);

// // - Move Backward
// buttons.on('Button1_change',(value) => {
//   if(currentSpeed > - 500 ){
//     currentSpeed = currentSpeed - 25;
//     motors.DrivePWM(currentSpeed,currentSpeed);
//
//     lcd.SetCursor(1,8);
//     lcd.Message( ("    " + currentSpeed).slice(-4) );
//   }
// });
//
// // - Move Forward
// buttons.on('Button2_change',(value) => {
//   if(currentSpeed < 500 ){
//     currentSpeed = currentSpeed + 25;
//     motors.DrivePWM(currentSpeed,currentSpeed);
//
//     lcd.SetCursor(1,8);
//     lcd.Message( ("    " + currentSpeed).slice(-4) );
//   }
// });

loops.forever(()=>{
  if(buttons.readButton1() == 1 && currentSpeed > -500){
    currentSpeed = currentSpeed - 1;
    motors.DrivePWM(currentSpeed,currentSpeed);

    lcd.SetCursor(1,8);
    lcd.Message( ("    " + currentSpeed).slice(-4) );
  }

  if(buttons.readButton2() == 1 && currentSpeed < 500){
    currentSpeed = currentSpeed + 1;
    motors.DrivePWM(currentSpeed,currentSpeed);

    lcd.SetCursor(1,8);
    lcd.Message( ("    " + currentSpeed).slice(-4) );
  }
});


process.on('SIGINT', function () {
  motors.LeftMotorStop();
  motors.RightMotorStop();
  process.exit();
});

process.on('SIGTERM', function () {
  motors.LeftMotorStop();
  motors.RightMotorStop();
  process.exit();
});

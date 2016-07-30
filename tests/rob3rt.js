var _loops = require('../libs/loops'),
    loops = new _loops(),
    sleep = require('sleep'),
    _line_sensors = require('../externals/eModules/NodeLibrary/LineSensorsModule'),
    line_sensors = new _line_sensors(),
    _motors = require('../externals/eModules/NodeLibrary/MotorsModule'),
    motors = new _motors();

var currentLine, prevLine = 0, currentError, prevError = 0, maxPWM = 40,
  currentPWM = 20, leftMotorPWM, rightMotorPWM, kp = 1,ki = 0.001, kd = 7, integral = 0,
  powerDifference = 0;
sleep.sleep(2);

loops.forever(()=>{
  currentLine = line_sensors.ReadLine();
  // console.log("Line: " +currentLine);
  if(currentLine == -1){
    currentLine = prevLine;
  }
  currentError = currentLine - 250;
  prevLine = currentLine;

  // Control
  integral += currentError;
  powerDifference = currentError*kp + integral*ki + (currentError - prevError)*kd;
  prevError = currentError;

  powerDifference = constrain(powerDifference,-currentPWM,currentPWM);

  // console.log("PowerDiff: " + powerDifference + ", maxPWM: " + currentPWM);
  if(powerDifference < 0){
    leftMotorPWM = currentPWM + powerDifference; // Decrease speed on left wheel
    rightMotorPWM = currentPWM;
  }else {
    leftMotorPWM = currentPWM;
    rightMotorPWM = currentPWM - powerDifference; // Decrease speed on right wheel
  }
  motors.DrivePWM(leftMotorPWM*10,rightMotorPWM*10);

  if(currentPWM < maxPWM){
    currentPWM = currentPWM + 0.01;
  }

});

function constrain(value, min, max){
    if(value > max){
        // value = max;
        return max;
    }

    if(value < min){
        // value = min;
        return min;
    }
    return value;
}

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

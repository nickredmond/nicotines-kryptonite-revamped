var MIN_ACCELERATION_TIME = 0.5; // y2
var MAX_ACCELERATION_TIME = 20; // y1
var MIN_WIND_SPEED = 1;
var MAX_WIND_SPEED = 1000;

var AirParticle = function(lifeSpanSeconds, colors, radii, stage, windSpeed, terminalVelocity){
  Particle.call(this, lifeSpanSeconds, colors, radii, stage);

  // TODO: set this to use constants in constructor AND then define them
  // Object.defineProperty(this, 'MIN_WIND_SPEED', {
  //   // value: 1,
  //   // writable: false,
  //   // enumerable: true,
  //   // configurable: true
  //   get: function(){return 1;}
  // });
  // Object.defineProperty(this, 'MAX_WIND_SPEED', {
  //   value: 1000,
  //   writable: false,
  //   enumerable: true,
  //   configurable: true
  // });

  if (windSpeed < MIN_WIND_SPEED || windSpeed > MAX_WIND_SPEED){
    throw 'Wind speed must be between ' + MIN_WIND_SPEED + ' and ' + MAX_WIND_SPEED;
  }
  this.windSpeed = windSpeed;
  this.terminalVelocity = terminalVelocity;

  var windFunctionSlope = (MIN_ACCELERATION_TIME - MAX_ACCELERATION_TIME) /
    (MAX_WIND_SPEED - MIN_WIND_SPEED);
  var wind_xIntercept = MAX_ACCELERATION_TIME - windFunctionSlope;
  var timeToAccelerate = (windFunctionSlope * windSpeed) + wind_xIntercept;
  
  this.windAcceleration = windSpeed / timeToAccelerate;

  //console.log('skywalker ' + AirParticle.MIN_WIND_SPEED + '---' + AirParticle.MAX_WIND_SPEED);
  this.previousSpeedDeltaX = 0;
  this.previousSpeedDeltaY = 0;
};

AirParticle.prototype = Object.create(Particle.prototype);
AirParticle.prototype.constructor = AirParticle;

AirParticle.prototype.update = function(dt){
  if (this.windSpeed !== MIN_WIND_SPEED){
    this.xAcceleration = (Math.abs(this.xVelocity) >= this.terminalVelocity) ? 0 : 
      this.windAcceleration;
  }
  Particle.prototype.update.call(this, dt);
};
var TERMINAL_VELOCITY = 800;
var VELOCITY_LIMIT_PERCENTAGE = 0.05;

var MouseParticleEffect = function(particlesPerSecond, baseColor, colorChangeParts, baseRadius, 
    baseLifespan, velocityRange, movementResistance, windSpeed, behavior, stage, canvas){
  ParticleEffect.call(this);

  if (movementResistance < 0){
    throw 'Movement resistance must be at least zero (represents a percentage of velocity per second)';
  }

  this.particlesPerSecond = particlesPerSecond;
  this.baseColor = baseColor;
  this.baseRadius = baseRadius;
  this.velocityRange = velocityRange;
  this.movementResistance = movementResistance;
  this.windSpeed = windSpeed;
  this.stage = stage;
  this.colorChangeParts = colorChangeParts;
  this.numberParticlesToCreate = 0;
  this.mousePosition = {x: 0, y: 0};
  this.behavior = behavior;

  Object.defineProperty(this, 'MAX_RGBA_DELTA', {
    value: 20,
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(this, 'MAX_RADIUS_DELTA', {
    value: 2,
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(this, 'MAX_LIFESPAN_DELTA', {
    value: 2,
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(this, 'MAX_COLOR_CHANGE', {
    value: 100,
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(this, 'MAX_RADIUS_CHANGE', {
    value: 6,
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(this, 'MIN_VELOCITY', {
    get: function() { return 1; }
  });
  Object.defineProperty(this, 'MAX_VELOCITY', {
    get: function() { return 5; }
  });

  function getMousePosition(canvas, evt){
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  var instance = this;
  //console.log('gecko ' + instance);

  canvas.addEventListener('mousemove', function(evt){
    //console.log('mothers ' + instance);
    instance.mousePosition = getMousePosition(canvas, evt);
  });

  this.updateParticles = function(dt){
    removedParticles = [];

    for (var i = 0; i < this.particles.length; i++){
      if (!this.particles[i].isAlive()){
        removedParticles.push(this.particles[i]);
      }
      else {
        particle = this.particles[i];

        if (particle.xVelocity * particle.xAcceleration > 0 &&
          particle.windSpeed === MIN_WIND_SPEED){
          particle.xVelocity = 0;
          particle.xAcceleration = 0;
        }
        if (particle.yVelocity * particle.yAcceleration > 0){
          particle.yVelocity = 0;
          particle.yAcceleration = 0;
        }
        
        particle.update(dt);
      }
    }

    for (var i = 0; i < removedParticles.length; i++){
      var nick = this.particles.length;
      this.particles.remove(removedParticles[i]);

      //console.log('FUCK ' + nick + ' - ' + this.particles.length + ' - ' + this.particles.indexOf(removedParticles[i]));
    }
  };

  this.randomVelocity = function(isRising, isXVelocity){
    var velocityLimit = this.velocityRange ? 
      this.velocityRange[1] : 
      this.MAX_VELOCITY;
    var velocityRequirement = this.velocityRange ?
      this.velocityRange[0] :
      this.MIN_VELOCITY;

    if (isRising && isXVelocity){
      velocityLimit *= VELOCITY_LIMIT_PERCENTAGE;
    }

    minVelocity = -velocityLimit;
    maxVelocity = velocityLimit * 2;
    velocity = (Math.random() * maxVelocity) + minVelocity;
    absoluteVelocity = Math.abs(velocity);
    multiplier = velocity / absoluteVelocity;

    //console.log('mushrooms ' + this.MIN_VELOCITY);

    if (absoluteVelocity < velocityRequirement){
      velocity = velocityRequirement * multiplier;
    }
    if (isRising && !isXVelocity && velocity > 0){
      velocity = -velocity;
    }

    return velocity;
  }

  this.randomAcceleration = function(velocity){
    var acceleration = -1 * this.movementResistance * velocity; //(Math.random() * 0.4) + 0.1;

    return acceleration;
  }

  this.createParticle = function(){
    lifespanRange = this.MAX_LIFESPAN_DELTA * 2;
    lifespanMin = baseLifespan - this.MAX_LIFESPAN_DELTA;
    lifespan = (Math.random() * lifespanRange) + lifespanMin;

    startingColorRange = this.MAX_RGBA_DELTA * 2;
    startingRedMin = this.baseColor.red - this.MAX_RGBA_DELTA;
    startingGreenMin = this.baseColor.green - this.MAX_RGBA_DELTA;
    startingBlueMin = this.baseColor.blue - this.MAX_RGBA_DELTA;
    startingAlphaMin = this.baseColor.alpha - this.MAX_RGBA_DELTA;
    startingRed = (Math.random() * startingColorRange) + startingRedMin;
    startingGreen = (Math.random() * startingColorRange) + startingGreenMin;
    startingBlue = (Math.random() * startingColorRange) + startingBlueMin;
    startingAlpha = 1;//(Math.random() * startingColorRange) + startingAlphaMin;
    startingColor = new Color(startingRed, startingGreen, startingBlue, startingAlpha);

    endingColorRange = this.MAX_COLOR_CHANGE * 2;
    endingRedMin = this.baseColor.red - this.MAX_COLOR_CHANGE;
    endingGreenMin = this.baseColor.green - this.MAX_COLOR_CHANGE;
    endingBlueMin = this.baseColor.blue - this.MAX_COLOR_CHANGE;
    endingRed = this.colorChangeParts.indexOf(ColorPart.RED) !== -1 ?
      (Math.random() * endingColorRange) + endingRedMin :
      startingRed;
    endingGreen = this.colorChangeParts.indexOf(ColorPart.GREEN) !== -1 ?
      (Math.random() * endingColorRange) + endingGreenMin :
      startingGreen;
    endingBlue = this.colorChangeParts.indexOf(ColorPart.BLUE) !== -1 ?
      (Math.random() * endingColorRange) + endingBlueMin :
      startingBlue;
    endingAlpha = 0;
    endingColor = new Color(endingRed, endingGreen, endingBlue, endingAlpha);

    startingRadiusRange = this.MAX_RADIUS_DELTA * 2;
    startingRadiusMin = this.baseRadius - this.MAX_RADIUS_DELTA;
    startingRadius = (Math.random() * startingRadiusRange) + startingRadiusMin;

    endingRadiusRange = this.MAX_RADIUS_CHANGE;
    endingRadiusMin = startingRadius;
    endingRadius = (Math.random() * endingRadiusRange) + endingRadiusMin;

    if (startingRadius < 0){
      startingRadius = 0.5;
    }
    if (endingRadius < 0){
      endingRadius = 1;
    }

    particle = new AirParticle(lifespan, [startingColor, endingColor],
      [startingRadius, endingRadius], this.stage, this.windSpeed, TERMINAL_VELOCITY);

    //console.log('inlaws' + this.mousePosition.x + '-' + this.mousePosition.y);
    particle.setPosition(this.mousePosition);

    var isRising = (this.behavior === ParticleBehavior.RISING);
    var xVelocity = this.randomVelocity(isRising, true);
    var yVelocity = this.randomVelocity(isRising, false);
    var xAcceleration = this.randomAcceleration(xVelocity);
    var yAcceleration = this.randomAcceleration(yVelocity);
    //console.log('turnips ' + xVelocity);
    particle.xVelocity = xVelocity;
    particle.yVelocity = yVelocity;
    particle.xAcceleration = xAcceleration;
    particle.yAcceleration = yAcceleration;

    this.particles.push(particle);
  };
};

MouseParticleEffect.prototype = Object.create(ParticleEffect.prototype);
MouseParticleEffect.prototype.constructor = MouseParticleEffect;

MouseParticleEffect.prototype.update = function(dt){
  //console.log('count ' + this.particles.length);
  this.updateParticles(dt);

  this.numberParticlesToCreate += this.particlesPerSecond * (dt / MILLISECONDS_PER_SECOND);

  if (this.numberParticlesToCreate >= 1){
    for (var i = 0; i < this.numberParticlesToCreate; i++){
      this.createParticle();
    }
    this.numberParticlesToCreate = 0;
  }
};

MouseParticleEffect.prototype.draw = function(){
  for (var i = 0; i < this.particles.length; i++){
    this.particles[i].draw();
  }
};
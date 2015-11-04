var MouseParticleEffect = function(particlesPerSecond, baseColor, colorChangeParts, baseRadius, 
    baseLifespan, stage, canvas){
  ParticleEffect.call(this);

  this.particlesPerSecond = particlesPerSecond;
  this.baseColor = baseColor;
  this.baseRadius = baseRadius;
  this.stage = stage;
  this.colorChangeParts = colorChangeParts;
  this.numberParticlesToCreate = 0;
  this.mousePosition = {x: 0, y: 0};

  Object.defineProperty(this, 'MAX_RGBA_DELTA', {
    value: 20,
    writable: false,
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(this, 'MAX_RADIUS_DELTA', {
    value: 5,
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
    value: 15,
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

        if (particle.xVelocity * particle.xAcceleration > 0){
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

  this.randomVelocity = function(){
    minVelocity = -this.MAX_VELOCITY;
    maxVelocity = this.MAX_VELOCITY * 2;
    velocity = (Math.random() * maxVelocity) + minVelocity;
    absoluteVelocity = Math.abs(velocity);
    multiplier = velocity / absoluteVelocity;

    //console.log('mushrooms ' + this.MIN_VELOCITY);

    if (absoluteVelocity < this.MIN_VELOCITY){
      velocity = this.MIN_VELOCITY * multiplier;
    }

    return velocity;
  }

  function randomAcceleration(velocity){
    acceleration = (Math.random() * 0.4) + 0.1;
    if (velocity > 0){
      acceleration *= -1;
    }

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

    //console.log('tater tots ' + this.baseRadius + ' - ' + startingRadiusMin + ' - ' + startingRadius);

    endingRadiusRange = this.MAX_RADIUS_CHANGE;
    endingRadiusMin = startingRadius;
    endingRadius = (Math.random() * endingRadiusRange) + endingRadiusMin;

    particle = new Particle(lifespan, [startingColor, endingColor],
      [startingRadius, endingRadius], this.stage);

    //console.log('inlaws' + this.mousePosition.x + '-' + this.mousePosition.y);
    particle.setPosition(this.mousePosition);

    var xVelocity = this.randomVelocity();
    var yVelocity = this.randomVelocity();
    var xAcceleration = randomAcceleration(xVelocity);
    var yAcceleration = randomAcceleration(yVelocity);
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
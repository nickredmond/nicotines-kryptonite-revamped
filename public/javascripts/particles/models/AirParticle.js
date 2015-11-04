var AirParticle = function(this, lifeSpanSeconds, colors, radii, stage){
  Particle.call(this, lifeSpanSeconds, colors, radii, stage);

  this.previousSpeedDeltaX = 0;
  this.previousSpeedDeltaY = 0;
};

AirParticle.prototype = Object.create(Particle.prototype);
AirParticle.prototype.constructor = AirParticle;
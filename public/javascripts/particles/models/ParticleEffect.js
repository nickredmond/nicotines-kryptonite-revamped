var ParticleEffect = function(){
  this.particles = [];
};

ParticleEffect.prototype = Object.create(Graphic.prototype);
ParticleEffect.prototype.constructor = ParticleEffect;
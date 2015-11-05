var ParticleEffect = function(){
  this.particles = [];
};

ParticleEffect.prototype = Object.create(Graphic.prototype);
ParticleEffect.prototype.constructor = ParticleEffect;

ParticleEffect.prototype.destroy = function(){
  for (var i = 0; i < this.particles.length; i++){
    this.particles[i].kill();
  }

  this.particles = null;
};
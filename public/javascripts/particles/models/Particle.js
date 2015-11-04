// Constructor
var Particle = function(lifeSpanSeconds, colors, radii, stage){
  // Call to super constructor with reference to this Particle
  Graphic.call(this, stage);

  this.lifeSpanSeconds = lifeSpanSeconds;
  this.colors = colors;
  this.radii = radii;

  this.currentColor = colors[0].toString();
  this.currentRadius = radii[0];
  //console.log('nephew ' + this.currentRadius);

  this.xVelocity = 0;
  this.yVelocity = 0;
  this.xAcceleration = 0;
  this.yAcceleration = 0;
  this.age = 0;

  this.hasBeenKilled = false;

  this.shape = new createjs.Shape();
  stage.addChild(this.shape);

  // Private method: only accessible by privelaged methods
  this.updateColor = function(){
    var transitionInfo = this.calculateTransitionInfo(this.colors.length);
  //  console.log('nelson ' + transitionInfo.index + '-' + this.colors.length);
    var currentIndexRed = this.colors[transitionInfo.index].red;
    var currentIndexGreen = this.colors[transitionInfo.index].green;
    var currentIndexBlue = this.colors[transitionInfo.index].blue;
    var currentIndexAlpha = this.colors[transitionInfo.index].alpha;

    var isTransitioning = transitionInfo.percentage > 0;

    var red = isTransitioning ?
      currentIndexRed + (transitionInfo.percentage * (this.colors[transitionInfo.index + 1].red - currentIndexRed)) :
      currentIndexRed;
    var green = isTransitioning ?
      currentIndexGreen + (transitionInfo.percentage * (this.colors[transitionInfo.index + 1].green - currentIndexGreen)) :
      currentIndexGreen;
    var blue = isTransitioning ?
      currentIndexBlue + (transitionInfo.percentage * (this.colors[transitionInfo.index + 1].blue - currentIndexBlue)) :
      currentIndexBlue;
    var alpha = isTransitioning ?
      currentIndexAlpha + (transitionInfo.percentage * (this.colors[transitionInfo.index + 1].alpha - currentIndexAlpha)) :
      currentIndexAlpha;

    this.currentColor = new Color(red, green, blue, 255);
    this.shape.alpha = alpha;
  }

  this.updateRadius = function(){
    transitionInfo = this.calculateTransitionInfo(this.radii.length);
    currentIndexRadius = this.radii[transitionInfo.index];
    radius = (transitionInfo.percentage > 0) ?
      currentIndexRadius + (this.radii[transitionInfo.index + 1] - currentIndexRadius) :
      currentIndexRadius;

    this.currentRadius = radius;
  }

  this.calculateTransitionInfo = function(numberOfStates){
    transitionPercentage = 0;
    currentIndex = 0;

    if (numberOfStates > 1){
      transitionLength = this.lifeSpanSeconds / (numberOfStates - 1);
     // console.log('len ' + transitionLength + ' - ' + this.age + ' - ' + this.lifeSpanSeconds);
      currentIndex = Math.floor(this.age / transitionLength);

      startingAge = transitionLength * currentIndex;
      endingAge = startingAge + transitionLength;
      transitionPercentage = (this.age - startingAge) / (endingAge - startingAge);
    }

    return {
      percentage: transitionPercentage,
      index: currentIndex
    };
  }

  // Privelaged method: can access private methods, and can be accessed by 
  // public methods
  this.updateTraits = function(){
    this.updateColor();
    this.updateRadius();
  }

  this.performAging = function(dt){
    this.age += dt / MILLISECONDS_PER_SECOND;

    if (this.age >= this.lifeSpanSeconds){
      this.stage.removeChild(this.shape);
      this.hasBeenKilled = true;
    }
  }
};

// these two lines make Particle inherit from Graphic
Particle.prototype = Object.create(Graphic.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function(dt){
  this.performAging(dt);

  //console.log('velxx ' + this.shape.x + ' - ' + this.shape.y);

  if (this.isAlive()){
    this.updateTraits();
    this.shape.x += this.xVelocity;
    this.shape.y += this.yVelocity;
    this.xVelocity += this.xAcceleration;
    this.yVelocity += this.yAcceleration;
  }

  //console.log('bread ' + this.shape + ' - ' + this.shape.x + ' - ' + this.shape.y);
};

Particle.prototype.draw = function(){
  //console.log('drat ' + this.shape.x + '==' + this.shape.y + '==' + this.currentColor.toString() + '==' + this.currentRadius);
  this.shape.graphics.clear();
  this.shape.graphics.beginFill(this.currentColor.toString()).drawCircle(0, 0, this.currentRadius);
};

Particle.prototype.isAlive = function(){
  return !this.hasBeenKilled;
};

Particle.prototype.getShape = function(){
  return this.shape;
};

Particle.prototype.setPosition = function(position){
  //console.log('outlaws ' + position.x + '-' + position.y);
  this.shape.x = position.x;
  this.shape.y = position.y;
}
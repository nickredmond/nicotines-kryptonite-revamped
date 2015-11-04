MILLISECONDS_PER_SECOND = 1000;

var Graphic = function(stage){
  this.stage = stage;
  this.shape = new createjs.Shape();

  this.xPosition = 0;
  this.yPosition = 0;
};

Graphic.prototype.update = function(dt){
  throw 'Must implement in a subclass';
};

Graphic.prototype.draw = function(){
  throw 'Must implement in a subclass';
};
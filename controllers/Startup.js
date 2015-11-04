var DT = 20;
var effect = null;

function Main(args){
  if (!Array.prototype.remove) {
    Array.prototype.remove = function(val) {
      var i = this.indexOf(val);
           return i>-1 ? this.splice(i, 1) : [];
    };
  }

  console.log('nick redmond');

  canvas = document.getElementById('mainCanvas');
  canvas.style.backgroundColor = '#000';
  stage = new createjs.Stage(canvas);

  baseColor = new Color(50, 50, 255, 255);
  colorChangeParts = [ColorPart.RED, ColorPart.BLUE];
  effect = new MouseParticleEffect(20, baseColor, colorChangeParts, 7, 1.5,
    stage, canvas);

  createjs.Ticker.addEventListener('tick', handleTick);
  createjs.Ticker.setInterval(DT);
}

function handleTick(){
  effect.update(DT);
  effect.draw();
  stage.update();
}
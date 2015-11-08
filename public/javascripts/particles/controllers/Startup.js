var DT = 20;
var effect = null;
var canvas = null;
var stage = null;

var handleTick = function(){
  effect.update(DT);
  effect.draw();
  stage.update();
}

function Main(args){
  if (!Array.prototype.remove) {
    Array.prototype.remove = function(val) {
      var i = this.indexOf(val);
           return i>-1 ? this.splice(i, 1) : [];
    };
  }

  addInputRangesToControls();

  canvas = document.getElementById('mainCanvas');
  canvas.style.backgroundColor = '#000';
  stage = new createjs.Stage(canvas);

  baseColor = new Color(50, 50, 255, 255);
  colorChangeParts = [ColorPart.RED, ColorPart.BLUE];
  effect = new MouseParticleEffect(10, baseColor, colorChangeParts, 10, 1.5,
    [0.2,5], 1, 50, ParticleBehavior.EXPANDING, stage, canvas);

  createjs.Ticker.addEventListener('tick', handleTick);
  createjs.Ticker.setInterval(DT);
}

function addInputRangesToControls(){
  var size_mappings = {
    '0': 'tiny',
    '1': 'small',
    '2': 'moderate',
    '3': 'large',
    '4': 'huge'
  };
  var number_particles_mappings = {
    '0': 'almost none',
    '1': 'a few',
    '2': 'some',
    '3': 'lots',
    '4': 'tons'
  };
  var wind_mappings = {
    '0': 'calm',
    '1': 'slight breeze',
    '2': 'breezy',
    '3': 'windy',
    '4': 'hurricane'
  };
  var speed_mappings = {
    '0': 'barely moving',
    '1': 'slow',
    '2': 'moderate',
    '3': 'fast',
    '4': 'very fast'
  };
  var resistance_mappings = {
    '0': 'none',
    '1': 'mild',
    '2': 'moderate',
    '3': 'severe',
    '4': 'extreme'
  };

  add_range('sizeControl', 0, 4, 1, 'sizeControlDiv', true, size_mappings);
  add_range('countControl', 0, 4, 1, 'countControlDiv', true, number_particles_mappings);
  add_range('speedControl', 0, 4, 1, 'speedControlDiv', true, speed_mappings);
  add_range('windControl', 0, 4, 1, 'windControlDiv', true, wind_mappings);
  add_range('resistanceControl', 0, 4, 1, 'resistanceControlDiv', true, resistance_mappings);
}
<script src="/javascripts/particles/range_adder.js"></script>

<script src="/javascripts/particles/enums/Direction.js"></script>
<script src="/javascripts/particles/enums/Height.js"></script>
<script src="/javascripts/particles/enums/ParticleBehavior.js"></script>
<script src="/javascripts/particles/models/Color.js"></script>
<script src="/javascripts/particles/models/ColorPart.js"></script>
<script src="/javascripts/particles/models/Graphic.js"></script>
<script src="/javascripts/particles/models/Particle.js"></script>
<script src="/javascripts/particles/models/AirParticle.js"></script>
<script src="/javascripts/particles/models/ParticleEffect.js"></script>
<script src="/javascripts/particles/models/MouseParticleEffect.js"></script>
<script src="/javascripts/particles/controllers/Startup.js"></script>
<div id="particleContainer">
  <div id="particlesHeaderDiv">
    <h1 style="margin-left: auto; margin-right: auto">Particle Madness</h1>
    <a id="backToSiteLink" class="particlesLink" href="#/home" ng-click="backToSite()">Back to Website</a>
    <a id="toggleControlsLink" href="#" class="particlesLink" ng-click="toggleControls()">Show Controls</a>
  </div>
  <div id="particleControls" ng-show="isControlsVisible()">
    <div class="pull-left">
      <div id="baseColorPicker">
        <h4 id="baseColorHeader">Base Color</h4>
        <color-picker ng-model="color">
        </color-picker>
        <input type="text" ng-model="color" ng-init="color = '#3232FF'" />
      </div>
      <div id="staticTraitsControls" class="particleControlsColumn">
        <div id="sizeControlDiv">
          <h4>Particle Size</h4>
        </div>
        <div id="countControlDiv">
          <h4>Number of Particles</h4>
        </div>
        <div id="windControlDiv">
          <h4>Wind</h4>
        </div>
      </div>
      <div id="behaviorControls" class="particleControlsColumn">
        <div id="behaviorControlDiv">
          <h4>Particle Behavior</h4>
          <select class="form-control" id="behaviorControl">
            <option>{{ expandingValue }}</option>
            <option>{{ risingValue }}</option>
          </select>
        </div>
        <div id="speedControlDiv">
          <h4>Particle Speed</h4>
        </div>
        <div id="resistanceControlDiv">
          <h4>Air Resistance</h4>
        </div>
      </div>
      <!-- <div id="airControls" class="particleControlsColumn">
        <div id="windControlDiv">
          <h4>Wind</h4>
        </div>
        <div id="resistanceControlDiv">
          <h4>Air Resistance</h4>
        </div>
      </div> -->
    </div>
    <!-- <button id="updateParticlesButton" class="btn btn-primary" ng-click="updateParticles()">Update</button> -->
  </div>
  <canvas id="mainCanvas" width="800" height="600"></canvas>
</div>
<script>
  Main(null);
</script>
<script src="/javascripts/particles/enums/Direction.js"></script>
<script src="/javascripts/particles/enums/Height.js"></script>
<script src="/javascripts/particles/models/Color.js"></script>
<script src="/javascripts/particles/models/ColorPart.js"></script>
<script src="/javascripts/particles/models/Graphic.js"></script>
<script src="/javascripts/particles/models/Particle.js"></script>
<script src="/javascripts/particles/models/ParticleEffect.js"></script>
<script src="/javascripts/particles/models/MouseParticleEffect.js"></script>
<script src="/javascripts/particles/controllers/Startup.js"></script>
<div id="particleContainer">
  <h1 style="margin-left: auto; margin-right: auto">Particle Madness</h1>
  <a id="backToSiteLink" href="#/home" ng-click="backToSite()">Back to Website</a>
  <canvas id="mainCanvas" width="800" height="600"></canvas>
</div>
<script>
  Main(null);
</script>
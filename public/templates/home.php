
  <div ng-show="errorMessage" class="alert alert-danger">
    <h4 class="errorMessage">{{ errorMessage }}</h4>
  </div>
  <div class="page-header" style="margin-top: 0;">
    <!-- add the apostophre when Im not devving anymore -->
    <h1 style="margin-top: 0;">Nicotines Kryptonite<br /><small>Helping you help yourself</small></h1>
  </div>
  <div id="indexTopStory" class="jumbotron">
    <img id="homeStoryImage" ng-src="{{ homeStoryImageUri }}" id="homeStoryImage" class="img-rounded" alt="{{ homeStoryImageUri }}" />
    <h1>{{ homeStoryTitle }}</h1>
    <p>{{ homeStorySummary | truncate:true:100:' ...' }}&nbsp;<a ng-click="setActive('none')" ng-href="#{{readMoreURL}}">Read More ></a></p>
  </div>
  <div id="deathToll" class="alert alert-info">
    <h2>{{ deathToll }}</h2>
  </div>

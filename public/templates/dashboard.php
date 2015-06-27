<script src="/javascripts/chart.js"></script>
<div class="page-header pageHeader">
  <h2>{{ dashboard.greeting }}, {{ dashboard.firstName }}! <small>{{ dashboard.subgreeting }}</small></h2>
</div>
<h3>Craving level:</h3>
<div class="progress">
  <div id="cravingLevelBar" class="progress-bar" role="progressbar" aria-valuenow="{{ dashboard.cravingLevel }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ dashboard.cravingLevel }}%; min-width: 8%;">{{ roundToTwoPlaces(dashboard.cravingLevel) }}%
  </div>
</div>
<div ng-show="dashboard.financialGoalCost !== -1">
  <h3>Progress toward financial goal: <small>{{ percentTowardGoal }}</small></h3>
  <div id="financialGoalProgressBar" class="progress">
    <div class="progress-bar progress-bar-success progress-bar-striped active" style="width: {{ dashboard.percentTowardGoal }}%; min-width: 10%; max-width: 90%;">
      ${{ roundToTwoPlaces(dashboard.moneySaved) }}
    </div>
    <div class="progress-bar progress-bar-info" role="progress-bar" style="width: {{ 100 - dashboard.percentTowardGoal }}%; min-width: 10%; max-width: 90%;">
      ${{ roundToTwoPlaces(dashboard.financialGoalCost - dashboard.moneySaved) }}
    </div>
  </div>
  <div>
    <div class="legendRow">
      <span class="label label-success keyLabel successColorLabel">_</span>
      <span>= Money Saved</span>
    </div>
    <div class="legendRow">
      <span class="label label-info keyLabel infoColorLabel">_</span>
      <span>= Money Remaining</span>
    </div>
  </div>
</div>
<div>
  <h3>Your Nicotine History</h3>
  <div id="chartContainer">
    <canvas id="nicotineHistoryChart" style="width: 100%; height: auto;"></canvas>
  </div>
  <span>Show data for the past</span>
  <select id="nicotineHistoryTimespanSelector" class="form-control" ng-model="chartTimespan" ng-change="updateChart()">
    <option selected>week</option>
    <option>two weeks</option>
  </select>
</div>
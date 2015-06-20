<div class="page-header">
	<h2>Milestones</h2>
</div>
<div class="alert alert-info" 
	 ng-hide="(completedMilestones && completedMilestones.length > 0) || !areMilestonesEnabled()">
	You have not completed any milestones yet. Keep saying no!
</div>
<div class="alert alert-warning" ng-hide="areMilestonesEnabled()">
	Milestones are made for cold turkey quitters. If you'd like to go cold turkey, then 
	<a href="#/feedback" ng-click="setActive('feedbackLink')">let us know</a> so we can add it to our site!
</div>
<div class="alert alert-success" ng-repeat="milestone in completedMilestones">
	{{ milestone }}
</div>
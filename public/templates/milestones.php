<div class="page-header">
	<h2>Milestones</h2>
</div>
<div class="alert alert-info" ng-hide="completedMilestones && completedMilestones.length > 0">
	You have not completed any milestones yet. Keep saying no!
</div>
<div class="alert alert-success" ng-repeat="milestone in completedMilestones">
	{{ milestone }}
</div>
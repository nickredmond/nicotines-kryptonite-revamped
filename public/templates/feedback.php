<div class="page-header">
	<h3>We'd love to hear from you!</h3>
</div>
<div class="alert alert-danger" ng-repeat="error in errorMessages">
	<span>{{ error }}</span>
</div>
<div ng-show="infoMessage" class="alert alert-success">
	<span>{{ infoMessage }}</span>
</div>
<p>If you have any suggestions for improvements, or if you found problems with our 
	site that affected your experience, then don't hesitate to let us know.</p>
<div class="input-group feedbackGroup">
	<span class="input-group-addon">Summary</span>
	<input type="text" class="form-control" ng-model="feedback.summary" />
</div>
<div class="input-group feedbackGroup">
	<span class="input-group-addon">Name or Username <small>(Optional)</small></span>
	<input type="text" class="form-control" ng-model="feedback.name" />
</div>
<label id="feedbackDescriptionLabel">Description:</label>
<textarea ng-model="feedback.content" rows="10" cols="75" placeholder="Say something... we're all ears!" />
<button id="feedbackSendButton" class="btn btn-primary" ng-click="provideFeedback()">Send Feedback</button>

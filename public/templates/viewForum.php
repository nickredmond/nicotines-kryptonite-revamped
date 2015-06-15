<div class="page-header" style="margin-top: 0;">
	<h1 style="margin-top: 0;">Forum - {{ forum.title }}</h1>
</div>
<!-- partially (mainly) duplicated in topic.php -->
<span ng-hide="forum.isUserAuthenticated">
	<a class="ngActionLink" ng-click="toggleModal()">Log In</a> or <a ng-click="beginSignup()" href="#/signup">Sign Up</a> to post new content.
</span>
<button ng-show="forum.isUserAuthenticated && !isCreatingTopic" class="btn btn-primary" ng-click="isCreatingTopic = true">New Topic</button>
<div ng-show="isCreatingTopic">
	<div>
		<img id="formUserAvatar" src="/images/default_avatar.png" />
		<input id="newTopicTitle" type="text" placeholder="Title" ng-model="newTopic.title" />
	</div>
	<div>
		<a class="ngActionLink" ng-click="addLinkTemplate()">Add Link</a>
	</div>
	<textarea id="newTopicContentArea" rows="4" cols="50" ng-model="newTopic.content" placeholder="Say something..."></textarea>
	<div>
		<button class="btn btn-primary" ng-click="createTopic()">Post</button>
		<a class="ngActionLink" ng-click="cancelTopicCreate()">Cancel</a>
	</div>
</div>
<table class="table">
	<tr>
		<td>Topic</td>
		<td>Replies</td>
		<td>Last Reply</td>
	<tr>
	<tr ng-repeat="topic in forum.topics">
		<td><a ng-href="#/forum/topics/{{ topic._id }}">{{ topic.title }}</a></td>
		<td>{{ topic.numberReplies }}</td>
		<td>By {{ topic.latestPost.author }}&nbsp;{{ topic.latestPost.timeSinceLastReply }} ago</td>
	</tr>
</table>
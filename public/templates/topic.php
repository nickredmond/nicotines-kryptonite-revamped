<div class="page-header">
	<h2><a ng-href="#/forum/{{ forum.id }}">{{ forum.title }}</a> &gt; {{ topic.title }}</h2>
	<small>Posted by <strong>{{ topic.creator }}</strong>&nbsp;{{ topic.post_date_info }}</small>
</div>
<div id="topicContentArea" ng-bind-html="topic.content">
</div>

<span ng-hide="isUserAuthenticated">
	<a class="ngActionLink" ng-click="toggleModal()">Log In</a> or <a ng-click="beginSignup()" href="#/signup">Sign Up</a> to post comments.
</span>

<div ng-show="isCreatingComment['topic']">
	<div>
		<img class="formUserAvatar" src="/images/default_avatar.png" />
		<input class="newTopicTitle" type="text" placeholder="Title" ng-model="newComment.title" />
	</div>
	<div>
		<a class="ngActionLink" ng-click="addLinkTemplate()">Add Link</a>
	</div>
	<textarea id="newCommentContentArea" rows="4" cols="50" ng-model="newComment.content" placeholder="Say something..."></textarea>
	<div>
		<button class="btn btn-primary" ng-click="createComment(topic._id)">Post</button>
		<a class="ngActionLink" ng-click="cancelCommentCreate()">Cancel</a>
	</div>
</div>
<div>
	<span class="sectionHeader">Comments</span>
	<hr class="contentBreak" color="#aaa" noshade>
</div>
<button id="topicCommentButton" ng-show="isUserAuthenticated && !isCreatingComment['topic']" 
			class="btn btn-primary"
			ng-click="openCommentForm('topic')">New Comment</button>
<div class="topicCommentArea" ng-repeat="comment in topic.comments">
	<div class="commentInfoArea">
		<img class="formUserAvatar" src="/images/default_avatar.png" />
		<strong class="newTopicTitle">{{ comment.title }}</strong><br />
		<span><em><strong>{{ comment.creator }}</strong> commented {{ comment.timeSincePosted }}</em></span>
	</div>
	<div ng-bind-html="comment.content">
	</div>
	<div ng-include="'/templates/commentForm.php'"></div>
	<div class="topicSubCommentArea" ng-repeat="subComment in comment.comments">
		<div class="commentInfoArea">
			<img class="formUserAvatar" src="/images/default_avatar.png" />
			<strong class="newTopicTitle">{{ subComment.title }}</strong><br />
			<span><em><strong>{{ subComment.creator }}</strong> commented {{ subComment.timeSincePosted }}</em></span>
		</div>
		<div ng-bind-html="subComment.content">
		</div>
	</div>
</div>
<div class="page-header">
	<h2><a ng-href="#/forum/{{ forum.id }}">{{ forum.title }}</a> &gt; {{ topic.title }}</h2>
	<small>Posted by <strong>{{ topic.creator }}</strong>&nbsp;{{ topic.post_date_info }}</small>
</div>
<div id="topicContentArea">
	{{ topic.content }}
</div>

<span ng-hide="isUserAuthenticated">
	<a class="ngActionLink" ng-click="toggleModal()">Log In</a> or <a ng-click="beginSignup()" href="#/signup">Sign Up</a> to post comments.
</span>

<div ng-show="isCreatingComment">
	<div>
		<img id="formUserAvatar" src="/images/default_avatar.png" />
		<input id="newCommentTitle" type="text" placeholder="Title" ng-model="newComment.title" />
	</div>
	<div>
		<a class="ngActionLink" ng-click="addLinkTemplate()">Add Link</a>
	</div>
	<textarea id="newCommentContentArea" rows="4" cols="50" ng-model="newComment.content" placeholder="Say something..."></textarea>
	<div>
		<button class="btn btn-primary" ng-click="createComment()">Post</button>
		<a class="ngActionLink" ng-click="cancelCommentCreate()">Cancel</a>
	</div>
</div>
<div>
	<span class="sectionHeader">Comments</span>
	<hr class="contentBreak" color="#aaa" noshade>
</div>
<button id="topicCommentButton" ng-show="isUserAuthenticated && !isCreatingComment" 
			class="btn btn-primary"
			ng-click="isCreatingComment = true">New Comment</button>
<div ng-repeat="comment in topic.comments">
	<div>
		<img src="/images/default_avatar.png" />
		<strong>{{ comment.title }}</strong><br />
		<span>{{ comment.author }} commented {{ comment.timeSincePosted }}</span>
	</div>
	<div>
		{{ comment.content }}
	</div>
</div>
<div ng-show="isCreatingComment[comment._id]">
	<div>
		<img class="formUserAvatar" src="/images/default_avatar.png" />
		<input class="newCommentTitle" type="text" placeholder="Title" ng-model="newComment.title" />
	</div>
	<div>
		<a class="ngActionLink" ng-click="addLinkTemplate()">Add Link</a>
	</div>
	<textarea id="newCommentContentArea" rows="4" cols="50" ng-model="newComment.content" placeholder="Say something..."></textarea>
	<div>
		<button class="btn btn-primary" ng-click="createComment(comment._id)">Post</button>
		<a class="ngActionLink" ng-click="cancelCommentCreate(comment._id)">Cancel</a>
	</div>
</div>
<a id="topicCommentButton" class="ngActionLink" ng-show="isUserAuthenticated && !isCreatingComment[comment._id]" 
			ng-click="openCommentForm(comment._id)">Reply</button>
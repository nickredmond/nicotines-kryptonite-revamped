<table class="table">
	<tr>
		<td>Forum</td>
		<td>Topics</td>
		<td>Posts</td>
		<td>Last Post</td>
	<tr>
	<tr ng-repeat="forumInfo in forumInfos">
		<td><a ng-href="#/forum/{{ forumInfo._id }}">{{ forumInfo.title }}</a></td>
		<td>{{ forumInfo.numberTopics }}</td>
		<td>{{ forumInfo.numberPosts }}</td>
		<td>By <strong>{{ forumInfo.latestPost.author}}</strong> {{ forumInfo.timeSinceLastPost }}</td>
	</tr>
</table>
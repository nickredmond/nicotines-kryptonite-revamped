<table class="table">
	<th>
		<td>Forum</td>
		<td>Topics</td>
		<td>Posts</td>
		<td>Last Post</td>
	<th>
	<tr ng-repeat="forumInfo in forumInfos">
		<td><a ng-href="#/forum/{{ forumInfo._id }}">{{ forumInfo.title }}</a></td>
		<td>{{ forumInfo.numberTopics }}</td>
		<td>{{ forumInfo.numberPosts }}</td>
		<td>By {{ forumInfo.latestPost.author}}&nbsp;{{ forumInfo.timeSinceLatestPost }} ago</td>
	</tr>
</table>
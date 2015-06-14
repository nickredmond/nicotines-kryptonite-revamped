<div class="page-header pageHeader">
<h1>{{ story.title }}</h1>
</div>
<div id="storyImageDiv">
	<img id="storyImage" ng-src="{{story.imageUri}}" class="img-rounded" />
</div>
<p id="storySummary" class="text-muted"><em>{{ story.summary }}</em></p>
<hr color="#aaa" noshade>
<div ng-include src="storyText"></div>
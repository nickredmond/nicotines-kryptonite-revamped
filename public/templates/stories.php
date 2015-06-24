<div class="page-header storiesPageHeader">
	<h2 class="storiesPageHeader">Stories</h2>
</div>
<div id="mainStoryArea" class="row">
	<div style="padding-left: 0px;" class="col-xs-5">
		<img style="max-width: 100%; height: auto;" ng-src="{{ stories[0].imageUri }}" />
	</div>
	<div class="col-xs-7">
		<a id="mainStoryLink" ng-click="setActive('none')" ng-href="#/stories/{{ stories[0]._id }}">
			{{ stories[0].title }}
		</a>
		<p>{{ stories[0].summary | truncate:true:75:' ...' }}</p>
	</div>
</div>
<div class="row">
	<div class="col-sm-6 storyAreaContainer">
		<div id="leftStoryArea" class="subStoryArea">
			<a class="subStoryLink" ng-click="setActive('none')" ng-href="#/stories/{{ stories[1]._id }}">
				{{ stories[1].title }}
			</a>
			<p>{{ stories[1].summary | truncate:true:75:' ...' }}</p>
		</div>
	</div>
	<div class="col-sm-6 storyAreaContainer">
		<div id="rightStoryArea" class="subStoryArea">
			<a class="subStoryLink" ng-click="setActive('none')" ng-href="#/stories/{{ stories[2]._id }}">
				{{ stories[2].title }}
			</a>
			<p>{{ stories[2].summary | truncate:true:75:' ...' }}</p>
		</div>
	</div>
</div>
<div class="listStoryArea" ng-repeat="story in listViewStories">
	<a ng-click="setActive('none')" ng-href="#/stories/{{ story._id }}">{{ story.title }}</a>
	<hr class="storyBreak" />
</div>
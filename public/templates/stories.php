<div class="page-header">
	<h2>Stories</h2>
</div>
<div>
	<img ng-src="stories[0].imageUri" />
	<h4>{{ stories[0].title }}</h4>
	<p>{{ stories[0].summary | truncate:true:75:' ...' }}</p>
</div>
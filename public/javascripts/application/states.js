app.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$momentProvider',
	function($stateProvider, $urlRouterProvider, $momentProvider){
		$momentProvider
	      .asyncLoading(false)
	      .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');

		$stateProvider.state('home', {
			url: '/home',
			templateUrl: '/templates/home.php',
			controller: 'HomeCtrl',
			resolve: {
				storyPromise: ['stories', function(stories){
					return stories.retrieveTopStory();
				}]
			},
			params: {errorMessage: null}
		});
		$stateProvider.state('signup', {
			url: '/signup',
			templateUrl: '/templates/signup.php',
			controller: 'SignupCtrl'
		});
		$stateProvider.state('viewStory', {
			url: '/stories/{id}',
			templateUrl: '/templates/viewStory.php',
			controller: 'StoryCtrl',
			resolve: {
				story: ['$stateParams', 'stories', function($stateParams, stories){
					return stories.get($stateParams.id);
				}]
			}
		});
		$stateProvider.state('dashboard', {
			url: '/dashboard',
			templateUrl: '/templates/dashboard.php',
			controller: 'DashboardCtrl',
			resolve: {
				dashboard: ['auth', function(auth){
					return auth.updateDashboard();
				}],
				authenticated: ['$q', 'auth', function($q, auth){
					return auth.isLoggedIn($q);
				}]
			}
		});
		$stateProvider.state('profile', {
			url: '/profile',
			templateUrl: '/templates/profile.php',
			controller: 'profileCtrl'
		});
		$stateProvider.state('forum', {
			url: '/forum',
			templateUrl: '/templates/forumIndex.php',
			controller: 'ForumCtrl',
			resolve: {
				forumsInfo: ['forumService', 'auth', function(forumService, auth){
					return forumService.retrieveForumsInfo(auth.getToken());
				}]
			}
		});
		$stateProvider.state('viewForum', {
			url: '/forum/{id}',
			templateUrl: '/templates/viewForum.php',
			controller: 'ForumPageCtrl',
			resolve: {
				forumInfo: ['$stateParams', 'forumService', 'auth', function($stateParams, forumService, auth){
					return forumService.retrieveForumInfo($stateParams.id, auth);
				}]
			}
		});
		$stateProvider.state('topic', {
			url: '/forum/topics/{id}',
			templateUrl: '/templates/topic.php',
			controller: 'TopicCtrl',
			resolve: {
				topicInfo: ['$stateParams', 'forumService', 'auth', function($stateParams, forumService, auth){
					return forumService.retrieveTopicInfo($stateParams.id, auth);
				}]
			}
		});
		$stateProvider.state('feedback', {
			url: '/feedback',
			templateUrl: '/templates/feedback.php',
			controller: 'FeedbackCtrl'
		});
		$stateProvider.state('milestones', {
			url: '/milestones',
			templateUrl: '/templates/milestones.php',
			controller: 'MilestoneCtrl',
			resolve: {
				completedMilestones: ['milestoneService', 'auth', function(milestoneService, auth){
					return milestoneService.retrieveCompletedMilestones(auth);
				}],
				authenticated: ['$q', 'auth', function($q, auth){
					return auth.isLoggedIn($q);
				}]
			}
		});
		$stateProvider.state('stories', {
			url: '/stories',
			templateUrl: '/templates/stories.php',
			controller: 'StoriesCtrl',
			resolve: {
				storyInfos: ['stories', function(stories){
					return stories.retrieveStoryPage(1);
				}]
			}
		})

		$urlRouterProvider.otherwise('home');
	}
]);
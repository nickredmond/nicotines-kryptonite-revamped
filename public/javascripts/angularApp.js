var SECONDS_PER_DEATH = 5.35;
var MILLIS_PER_SECOND = 1000;
var DEATH_UPDATE_INTERVAL = 10000;
var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var USER_LINK_TEMPLATE = '#URL here:::link text here#'

//--- HELPER FUNCTIONS ---//
function populateStates(){
	var statesList = [
			/*'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'D.C.', 'DE', 'FL',
			'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
			'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
			'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
			'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',*/ 'UT'/*, 'VT',
			'VA', 'WA', 'WV', 'WI', 'WY', 'Puerto Rico', 'American Samoa',
			'Guam', 'Northern Mariana Islands', 'U.S. Virgin Islands',
			'Outside the U.S.'*/
	];

	var stateSelect = document.getElementById('stateSelect');

	for (var i = 0; i < statesList.length; i++){
		state = statesList[i];
		var option = document.createElement("option");
		option.value = state;
		option.innerHTML = state;
		
		stateSelect.appendChild(option);
	}
}

function populateCigaretteBrands(){
	var cigaretteBrands = [
		'Marlboro'/*, 'Camel', 'L&M', 'Newport', 'Dunhill',
		'Pall Mall', 'Winston', 'Parliament'*/
	];

	var cigSelect = document.getElementById('cigaretteBrands');

	for (var i = 0; i < cigaretteBrands.length; i++){
		brand = cigaretteBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		cigSelect.appendChild(option);
	}
}

function populateSmokelessBrands(){
	var smokelessBrands = [
		'Copenhagen'/*, 'Skoal', 'Husky', 'Grizzly', 'Kodiak',
		'Red Man', 'Levi Garrett', 'Longhorn', 'Marlboro',
		'Camel', 'Lucky Strike', 'Knox'*/
	];

	var smokelessSelect = document.getElementById('smokelessBrands');

	for (var i = 0; i < smokelessBrands.length; i++){
		brand = smokelessBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		smokelessSelect.appendChild(option);
	}
}

function populateCigarBrands(){
	var cigarBrands = [
		'ACID'/*, 'Macanudo', 'H. Upmann', 'Ashton', 'Montecristo',
		'Romeo y Julieta', 'Padron'*/
	];

	var cigarSelect = document.getElementById('cigarBrands');

	for (var i = 0; i < cigarBrands.length; i++){
		brand = cigarBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		cigarSelect.appendChild(option);
	}
}

function roundToTwoPlaces(value){
	return (Math.round((value + 0.00001) * 100) / 100);
}

//--- ANGULAR APP CONSTRUCTION ---//
var app = angular.module('nicotinesKryptonite', ['ui.router', 'angular-momentjs']);

app.controller('HomeCtrl', [
	'$scope',
	'$interval',
	'$stateParams',
	'stories',
	'auth',
	'signup',
	function($scope, $interval, $stateParams, stories, auth, signup){
		$scope.errorMessage = $stateParams.errorMessage;

		$scope.deathToll = 0;
		var topStory = stories.topStory;
		$scope.homeStoryImageUri = topStory.imageUri;
		$scope.homeStoryTitle = topStory.title;
		$scope.homeStorySummary = topStory.summary;
		$scope.readMoreURL = "/stories/" + topStory._id;

		$scope.numberWithCommas = function(x) {
		    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		};
		$scope.updateDeathToll = function(){
			var currentYear = new Date().getFullYear();
			var startOfYear = new Date(currentYear, 1, 1);
			var secondsThisYear = Math.abs(new Date() - startOfYear) / MILLIS_PER_SECOND;

			var deathsThisYear = secondsThisYear / SECONDS_PER_DEATH;

			$scope.deathToll = $scope.numberWithCommas(Math.floor(deathsThisYear)) + " deaths from tobacco this year.";
		};

		$scope.updateDeathToll();
		$interval($scope.updateDeathToll, DEATH_UPDATE_INTERVAL);
	}
]);

app.controller('DashboardCtrl', [
	'$scope',
	'$interval',
	'auth',
	'dashboard',
	function($scope, $interval, auth, dashboard){
		$scope.dashboard = auth.dashboard;
		$scope.dashboard.percentTowardGoal = 100 * ($scope.dashboard.moneySaved / $scope.dashboard.financialGoalCost);

		$scope.roundToTwoPlaces = function(value){
			return roundToTwoPlaces(value);
		}

		var cravingBar = document.getElementById('cravingLevelBar');
		if ($scope.dashboard.cravingLevel < 50){
			cravingBar.classList.add("progress-bar-success");
		}
		else if ($scope.dashboard.cravingLevel < 80){
			cravingBar.classList.add("progress-bar-warning");
		}
		else cravingBar.classList.add("progress-bar-danger");

		$interval(function(){
			auth.updateDashboard();
		}, (60000 * 2));
	}
]);

app.controller('SignupCtrl', [
	'$scope',
	'$state',
	'auth',
	'signup',
	'nav',
	function($scope, $state, auth, signup, nav){
		// TODO: Get dropdown arrays from server
		populateStates();
		populateCigaretteBrands();
		populateSmokelessBrands();
		populateCigarBrands();

		$scope.registrationErrors = [];

		$scope.tobaccoTypes = ['Cigarettes', 'Smokeless Tobacco', 'Cigars'];
		$scope.user = {
			selectedTobaccoTypes: []
		};

		$scope.quittingMethods = [
			"Cold Turkey",
            // "Nicotine Gum",
            "Nicotine Lozenges",
            // "Nicotine Patches",
          	// "Electronic Cigarettes",
          	// "Weening"
		];
		$scope.quittingMethodSelected = function(method){
			signup.getNrtBrands(method, function(brandNames){
				$scope.nrtBrands = brandNames;
			});
		};
		$scope.getCurrentNrtMethod = function(method){
			return signup.brandNames;
		};

		$scope.toggleTobaccoSelection = function(tobaccoType){
			var index = $scope.user.selectedTobaccoTypes.indexOf(tobaccoType);

			if (index > -1){
				$scope.user.selectedTobaccoTypes.splice(index, 1);
			}
			else {
				$scope.user.selectedTobaccoTypes.push(tobaccoType);
			}
		};
		$scope.register = function(){
			if ($scope.user.password !== $scope.user.passwordConfirmation){
				$scope.registrationErrors.push('Password and confirmation do not match');
			}
			else {
				$scope.user.quittingMethod = $scope.method;

				auth.register($scope.user).error(function(error){
					if (error.messages){
						for (var i = 0; i < error.messages.length; i++){
							$scope.registrationErrors.push(error.messages[i]);
						}
					}
					else if (error.indexOf("E11000") > -1){
						if (error.indexOf("username") > -1 && error.indexOf("duplicate key error") > -1){
							$scope.registrationErrors.push("Username is already taken");
						}
						if (error.indexOf("email") > -1 && error.indexOf("duplicate key error") > -1){
							$scope.registrationErrors.push("Email is already taken");
						}
					}
					signup.goNextPage('Info');
				}).then(function(){
					$scope.registrationErrors = [];
					nav.setActive('dashboardLink');
					$state.go('dashboard');
				});
			}
		};
		$scope.getSignupPage = function(){
			return signup.getSignupPage();
		};
		$scope.goNextPage = function(pageTitle){
			$scope.registrationErrors = [];
			signup.goNextPage(pageTitle);
		};
	}
]);

app.controller('NavCtrl', [
	'$scope',
	'$state',
	'auth',
	'signup',
	'nav',
	'userInfo',
	function($scope, $state, auth, signup, nav, userInfo){
		$scope.beginSignup = function(){
			$scope.errors = [];
			nav.setActive('none');
			signup.beginSignup();
		};

		$scope.user = {};
		$scope.errors = [];

		$scope.isEmailAddress = function(text){
			return EMAIL_REGEX.test(text);
		};

		$scope.logIn = function(){
			$scope.toggleModal();
			$scope.errors = [];

			auth.logIn($scope.user).error(function(error){
				$scope.errors.push(error.message);
			}).then(function(){
				$scope.errors = [];
				nav.setActive('dashboardLink');
				$state.go('dashboard');
			});
		};
		$scope.logout = function(){
			nav.setActive('homeLink');
			auth.logOut();
		};

		$scope.showModal = false;

		$scope.toggleModal = function(){
			$scope.showModal = !$scope.showModal;
		};

		$scope.isLoggedIn = function(){
			return auth.isLoggedIn(null);
		};
		$scope.setActive = function(element_id){
			nav.setActive(element_id);
		};
	}
]);

app.directive('modal', function(){
	return {
		template: '<div class="modal fade">' +
			'<div class="modal-dialog">' +
				'<div class="modal-content">' +
					'<div class="modal-header">' +
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
						'<h4 class="modal-title">{{ title }}</h4>'  +
					'</div>' +
					'<div class="modal-body" ng-transclude></div>' +
				'</div>' +
			'</div>' +
		'</div>',
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: true,
		link: function postLink(scope, element, attrs) {
			scope.title = attrs.title;

			scope.$watch(attrs.visible, function(value){
				if (value){
					$(element).modal('show');
				}
				else {
					$(element).modal('hide');
				}
			});

			$(element).on('shown.bs.modal', function(){
				scope.$apply(function(){
					scope.$parent[attrs.visible] = true;
				});
			});
			$(element).on('hidden.bs.modal', function(){
				scope.$apply(function(){
					scope.$parent[attrs.visible] = false;
				});
			});
		}
	};
});

app.controller('StoriesCtrl', [
	'$scope',
	'$sce',
	'story',
	function($scope, $sce, story){
		$scope.story = story;
		$scope.storyText = $sce.trustAsResourceUrl(story.storyUri);
	}
]);

app.controller('TobaccoCostCtrl', [
	'$scope',
	'$http',
	'auth',
	'userInfo',
	function($scope, $http, auth, userInfo){
		//userInfo.getTobaccoCost

		$scope.tobaccoCostCallback = function(tobaccoCostInfo){
			$scope.cigarettePrice = tobaccoCostInfo.cigarettePrice;
			$scope.dipPrice = tobaccoCostInfo.dipPrice;
			$scope.cigarPrice = tobaccoCostInfo.cigarPrice;
			$scope.dateQuit = new Date(tobaccoCostInfo.dateQuit);
			$scope.infoMessage = tobaccoCostInfo.infoMessage;
			$scope.errorMessage = tobaccoCostInfo.errorMessage;

			$scope.financialGoalTitle = (tobaccoCostInfo.financialGoalItem ?
				"My Financial Goal" : "Add a financial goal");
			$scope.financialGoalButtonText = (tobaccoCostInfo.financialGoalItem ?
				"Update" : "Add");
			$scope.financialGoalItem = tobaccoCostInfo.financialGoalItem;
			$scope.financialGoalCost = tobaccoCostInfo.financialGoalCost;
		};
		
		userInfo.getTobaccoCost(auth.getToken(), $scope.tobaccoCostCallback);

		$scope.updateProfile = function(){
			var updateData = {
				cigarettePrice: $scope.cigarettePrice,
				dipPrice: $scope.dipPrice,
				cigarPrice: $scope.cigarPrice,
				dateQuit: $scope.dateQuit,

				financialGoalItem: $scope.financialGoalItem,
				financialGoalCost: $scope.financialGoalCost,

				token: auth.getToken()
			};

			if ($scope.usageInfos[0].quantity !== 0){
				updateData.nicotineUsages = $scope.usageInfos;
			}

			$http.post("/updateTobaccoCost", updateData).success(function(updateInfo){
				$scope.errorMessage = null;
				$scope.infoMessage = updateInfo.message;
				auth.updateDashboard();
			}).error(function(err){
				$scope.infoMessage = null;
				$scope.errorMessage = err.message;
			});
		};

		$scope.usageInfos = [
			{
				date: new Date(),
				nicotineType: "Cigarettes",
				quantity: 0
			}
		];

		$scope.addUsageInfo = function(){
			var addedInfo = {
				date: new Date(),
				nicotineType: "Cigarettes",
				quantity: 0
			}
			$scope.usageInfos.push(addedInfo);
		};
	}
]);

app.controller('ForumCtrl', [
	'$scope',
	'forumService',
	'forumsInfo',
	'$moment',
	function($scope, forumService, forumsInfo, $moment){
		$scope.isAuthenticated = forumsInfo.data.isUserAuthenticated;
		var forumInfos = forumsInfo.data.forumInfos;

		var moreInfos = [];

		for (var i = 0; i < forumInfos.length; i++){
			var nextInfo = forumInfos[i];

			var finalDate = nextInfo.latestPost ? new Date(nextInfo.latestPost.date) : null;
			var timeSinceCreated = finalDate ? $moment(finalDate).fromNow() : '';

			nextInfo.timeSinceLastPost = timeSinceCreated;

			moreInfos.push(nextInfo);
		}

		$scope.forumInfos = moreInfos;
}]);

app.controller('ForumPageCtrl', [
	'$scope',
	'auth',
	'forumService',
	'forumInfo',
	'$moment',
	function($scope, auth, forumService, forumInfo, $moment){
		$scope.forum = forumInfo;
		$scope.newTopic = {};

		var moreTopics = [];

		for (var i = 0; i < forumInfo.topics.length; i++){
			var topic = forumInfo.topics[i];

			var finalDate = topic.latestPost ? new Date(topic.latestPost.date) : null;
			var timeSinceCreated = finalDate ? $moment(finalDate).fromNow() : '';

			topic.latestPost.timeSinceLastReply = timeSinceCreated;

			moreTopics.push(topic);
		}

		$scope.addLinkTemplate = function(){
			document.getElementById('newTopicContentArea').value += ' ' + USER_LINK_TEMPLATE;
		};
		$scope.cancelTopicCreate = function(){
			$scope.isCreatingTopic = false;
			document.getElementById('newTopicContentArea').value = '';
			document.getElementById('newTopicTitle').value = '';
		};
		$scope.createTopic = function(){
			forumService.createTopic($scope.forum._id, auth, $scope.newTopic, function(createdTopic){
				$scope.newTopic = {};
				$scope.forum.topics.push(createdTopic);
				$scope.cancelTopicCreate();
			});
		};
}]);

app.controller('TopicCtrl', [
	'$scope',
	'forumService',
	'topicInfo',
	'auth',
	'$moment',
	function($scope, forumService, topicInfo, auth, $moment){
		$scope.topic = topicInfo.topic;
		$scope.isUserAuthenticated = topicInfo.isUserAuthenticated;
		$scope.forum = topicInfo.forum;

		$scope.isCreatingComment = {};

		var comments = topicInfo.topic.comments;

		var moreComments = [];

		for (var i = 0; i < comments.length; i++){
			var nextComment = comments[i];

			var finalDate = new Date(nextComment.date_created);
			var timeSinceCreated = $moment(finalDate).fromNow();

			nextComment.timeSincePosted = timeSinceCreated;
			moreComments.push(nextComment);

			var moreSubComments = [];

			for (var j = 0; j < nextComment.comments.length; j++){
				var subComment = nextComment.comments[j];

				finalDate = new Date(nextComment.date_created);
				timeSinceCreated = $moment(finalDate).fromNow();

				subComment.timeSincePosted = timeSinceCreated;
				moreSubComments.push(subComment);
			}

			$scope.topic.comments[i].comments = moreSubComments;
		}

		$scope.topic.comments = moreComments;

		$scope.newCommentInit = function(){
			$scope.newComment = {
				isTopicComment: true,
				title: '',
				content: ''
			};
		};
		$scope.newCommentInit();

		$scope.addLinkTemplate = function(){
			// var textArea = $scope.newComment.isTopicComment ? 
			// 				document.getElementById('newCommentContentArea') :
			// 				document.getElementById('comment_' + comment_id + '_contentArea');

			// textArea.value += ' ' + USER_LINK_TEMPLATE;
			$scope.newComment.content += ' ' + USER_LINK_TEMPLATE;
		};
		$scope.cancelCommentCreate = function(comment_id){
			if (comment_id){
				$scope.isCreatingComment[comment_id] = false;
			} 
			else {
				$scope.isCreatingComment['topic'] = false;
			}

			// var textArea = $scope.newComment.isTopicComment ? 
			// 				document.getElementById('newCommentContentArea') :
			// 				document.getElementById('comment_' + comment_id + '_contentArea');
			// var titleElement = $scope.newComment.isTopicComment ?
			// 					document.getElementById('newCommentTitle') :
			// 					document.getElementById('comment_' + comment_id + '_title');

			// textArea.value = '';
			// titleElement.value = '';
			$scope.newComment.title = '';
			$scope.newComment.content = '';
		};
		$scope.createComment = function(post_id){
			forumService.createComment(post_id, auth, $scope.newComment, function(author){
				var createdComment = {
					title: $scope.newComment.title,
					content: $scope.newComment.content,
					creator: author,
					timeSincePosted: 'a few seconds ago'
				}
				$scope.newCommentInit();

				if (post_id !== $scope.topic._id){
					var foundComment = false;

					for (var i = 0; i < $scope.topic.comments.length && !foundComment; i++){
						var comment = $scope.topic.comments[i];

						if (comment._id === post_id){
							foundComment = true;
							comment.comments.push(createdComment);
						}
					}

					$scope.cancelCommentCreate(post_id);
				}
				else {
					$scope.topic.comments.push(createdComment);
					$scope.cancelCommentCreate();
				}
			});
		};
		$scope.openCommentForm = function(post_id){
			$scope.isCreatingComment = {};
			$scope.isCreatingComment[post_id] = true;
		};
}]);

app.factory('stories', [
	'$http',
	function($http){
		var service = {
			topStory: {}
		};

		service.retrieveTopStory = function(){
			return $http.get('/topStory').success(function(data){
				angular.copy(data.story, service.topStory);
			});
		};
		service.get = function(id){
			return $http.get('/stories/' + id).then(function(response){
				return response.data;
			});
		};

		return service;
	}
]);

app.factory('signup', ['$http',
	function($http){
		var service = { currentSignupPage: 'None'
		};

		service.getSignupPage = function(){
			return service.currentSignupPage;
		};
		service.goNextPage = function(pageTitle){
			service.currentSignupPage = pageTitle;
		};
		service.beginSignup = function(){
			service.currentSignupPage = 'Intro';
		};
		service.getNrtBrands = function(method, callback){
			$http.get('/nrtBrands?quittingMethod=' + method).success(function(data){
				callback(data.brandNames);
			});
		};

		return service;
	}
]);

app.factory('nav', ['$location', '$window', function($location, $window){
	var nav = {};

	nav.setActive = function(element_id){
		var userActiveElement = document.getElementsByClassName("userLinkActive")[0];
		var activeElement = document.getElementsByClassName("active")[0];

		if (userActiveElement){
			userActiveElement.classList.remove("userLinkActive");
		}
		if (activeElement){
			activeElement.classList.remove("active");
		}

		if (element_id && element_id !== 'undefined'){
			if (element_id !== 'none'){
				var classList = document.getElementById(element_id).classList;

				if (classList.contains("userLink")){
					classList.add("userLinkActive");
				}
				else {
					classList.add("active");
				}
			}
			$window.localStorage['active-nav-id'] = element_id;
		}
		else {
			nav.setActive('homeLink');
		}
	};
	nav.getActive = function(){
		return $window.localStorage['active-nav-id'];
	};

	return nav;
}]);

app.factory('userInfo', ['$http', function($http){
	var userInfo = {};

	userInfo.getTobaccoCost = function(token, callback){
		var user = {
			token: token
		};
		
		$http.post('/tobaccoCost', user).success(function(data){
			var tobaccoCostInfo = {
				infoMessage: data.infoMessage,
				errorMessage: data.errorMessage,
				cigarettePrice: data.cigarettePrice,
				dipPrice: data.dipPrice,
				cigarPrice: data.cigarPrice,
				dateQuit: data.dateQuit,
				financialGoalItem: data.financialGoalItem,
				financialGoalCost: data.financialGoalCost
			};

			callback(tobaccoCostInfo);
		}).error(function(err){ 
			var tobaccoCostInfo = {
				errorMessage: err.message
			};
			callback(tobaccoCostInfo);
		});
	};

	return userInfo;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {
		dashboard: {},
		tobaccoPrices: {}
	};

	auth.saveToken = function(token){
		$window.localStorage['nicotines-kryptonite-token'] = token;
	};
	auth.getToken = function(){
		return $window.localStorage['nicotines-kryptonite-token'];
	};
	auth.isLoggedIn = function($q){
		var token = auth.getToken();
		var isAuthenticated = false;

		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			isAuthenticated = payload.exp > Date.now() / 1000;
		}

		if ($q){
			var deferred = $q.defer();

			if (isAuthenticated){
				deferred.resolve();
			}
			else {
				deferred.reject('You must be logged in to view that page.');
			}

			return deferred.promise;
		}
		else return isAuthenticated;
	};
	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
			auth.dashboard = data.dashboard;

			if (auth.dashboard.cravingLevel < 0) {
				auth.dashboard.cravingLevel = 0;
			}
		});
	};
	auth.logIn = function(user){
		return $http.post('/dashboard', user)
					.success(function(data){
						auth.saveToken(data.token);
						auth.dashboard = data.dashboard;

						if (auth.dashboard.cravingLevel < 0) {
							auth.dashboard.cravingLevel = 0;
						}
					});
	};
	auth.updateDashboard = function(){
		var token = auth.getToken();

		if (token){
			var user = {
				token: token
			};
			return auth.logIn(user);
		}
	};
	auth.logOut = function(){
		$window.localStorage.removeItem('nicotines-kryptonite-token');
	};

	return auth;
}]);

app.factory('forumService', ['$http', function($http){
	var service = {};

	service.getForumRequestBody = function(auth){
		return (auth.isLoggedIn() ? {token: auth.getToken()} : {});
	}
	service.retrieveForumsInfo = function(token){
		return $http.post('/forum', {token: token}).success(function(data){
			angular.copy(data, service.forumsInfo);
		}).error(function(err){
			alert('error this: ' + err);
		});
	};
	service.retrieveForumInfo = function(id, auth){
		var requestBody = service.getForumRequestBody(auth);

		return $http.post('/forums/' + id, requestBody).then(function(response){
			service.currentForumInfo = response.data;
			return response.data;
		});
	};
	service.retrieveTopicInfo = function(id, auth){
		var requestBody = service.getForumRequestBody(auth);

		return $http.post('/forum/topics/' + id, requestBody).then(function(response){
			var topicInfo = response.data;
			topicInfo.forum = {
				id: service.currentForumInfo._id,
				title: service.currentForumInfo.title
			}

			var creationDate = new Date(topicInfo.topic.date_created).toString();
			var dateTokens = creationDate.split(' ');

			var post_date_info = 'on ' + dateTokens[0] + ', ' + dateTokens[1] + ' ' + dateTokens[2] + ', ' +
									dateTokens[3] + ' at ';

			var timeTokens = dateTokens[4].split(':');
			var hour = parseInt(timeTokens[0]);
			var meridianValue = 'am';

			if (hour > 12){
				meridianValue = 'pm';
				hour -= 12;
			}

			post_date_info += hour.toString() + ':' + timeTokens[1] + ' ' + meridianValue;
			topicInfo.topic.post_date_info = post_date_info;
		
			return topicInfo;
		});
	};
	service.createTopic = function(forum_id, auth, topic, callback){
		return $http.post('/forum/topics/create', {
			topic: topic, 
			token: auth.getToken(),
			forum_id: forum_id
		}).then(function(data){
			var newTopic = {
				_id: data.data.topic_id,
				title: topic.title,
				numberReplies: 0,
				latestPost: {
					author: null
				}
			};
			callback(newTopic);
		});
	};
	service.createComment = function(post_id, auth, comment, callback){
		return $http.post('/forum_topic/comments/new_comment', {
			comment: comment,
			token: auth.getToken(),
			post_id: post_id
		}).then(function(data){
			callback(data.data.author);
		});
	};

	return service;
}]);

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
			controller: 'StoriesCtrl',
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
		$stateProvider.state('tobaccoCost', {
			url: '/tobaccoCost',
			templateUrl: '/templates/profile.php',
			controller: 'TobaccoCostCtrl'
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

		$urlRouterProvider.otherwise('home');
	}
]);

/* FILTER FUNCTION COURTESY OF: stackoverflow user 'EpokK' */
app.filter('truncate', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

app.run(['$rootScope', '$state', 'nav', 'signup', function($rootScope, $state, nav, signup){
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
		$state.go('home', {errorMessage: error});
	});
	$rootScope.$on('$locationChangeSuccess', function () {
        nav.setActive(nav.getActive());
        signup.goNextPage('Intro');
    });
}]);
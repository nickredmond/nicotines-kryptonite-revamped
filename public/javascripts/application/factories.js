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

	userInfo.getprofile = function(token, callback){
		var user = {
			token: token
		};
		
		$http.post('/profile', user).success(function(data){
			var time = new Date(data.dateQuit);
			time.setMilliseconds(0);
			time.setSeconds(0);

			var profileInfo = {
				infoMessage: data.infoMessage,
				errorMessage: data.errorMessage,
				cigarettePrice: data.cigarettePrice,
				dipPrice: data.dipPrice,
				cigarPrice: data.cigarPrice,
				dateQuit: {date: new Date(data.dateQuit), time: time},
				financialGoalItem: data.financialGoalItem,
				financialGoalCost: data.financialGoalCost
			};

			callback(profileInfo);
		}).error(function(err){ 
			var profileInfo = {
				errorMessage: err.message
			};
			callback(profileInfo);
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
						$window.localStorage['are-milestones-enabled'] = data.areMilestonesEnabled;

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
	auth.areMilestonesEnabled = function(){
		var areMilestonesEnabled = $window.localStorage['are-milestones-enabled'];
		return (areMilestonesEnabled === 'true' || areMilestonesEnabled === true);
	}

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
			callback(data.data.author, data.data.id);
		});
	};

	return service;
}]);

app.factory('milestoneService', ['$http', function($http){
	var service = {};

	service.retrieveCompletedMilestones = function(auth){
		return $http.post('/milestones', {token: auth.getToken()}).then(function(data){
			return data.data.completedMilestones;
		});
	}

	return service;
}]);
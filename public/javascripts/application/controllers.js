app.controller('HomeCtrl', [
	'$scope',
	'$http',
	'$interval',
	'$stateParams',
	'stories',
	'auth',
	'signup',
	function($scope, $http, $interval, $stateParams, stories, auth, signup){
		$http.get('/version').then(function(data){
			$scope.version = data.data.version;
		});

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
	'nav',
	function($scope, $interval, auth, dashboard, nav){
		$scope.dashboard = auth.dashboard;
		$scope.dashboard.percentTowardGoal = 100 * ($scope.dashboard.moneySaved / $scope.dashboard.financialGoalCost);
		nav.areMilestonesEnabled = auth.areMilestonesEnabled;

		var nicotineTypes = [];
		for (var i = 0; i < auth.nicotineUsages.length; i++){
			if (!nicotineTypes.includes(auth.nicotineUsages[i].nicotineType)){
				nicotineTypes.push(auth.nicotineUsages[i].nicotineType);
			}
		}

		var resetNicotineHistoryChart = function(){
			var canvas = document.querySelector('#nicotineHistoryChart');
			if (canvas) canvas.remove();

			$('#chartContainer').append('<canvas id="nicotineHistoryChart" style="width: 100%; height: auto;"></canvas>');
			var canvas = document.querySelector('#nicotineHistoryChart');

			var context = document.getElementById('nicotineHistoryChart').getContext('2d');
			var chartData = generateChartData(auth.nicotineUsages, nicotineTypes, $scope.chartTimespan);
			
			var chart = new Chart(context).Line(chartData.data, chartData.options);
		};

		var legendInfos = [
			{
				nicotineType: 'cigarette',
				color: 'rgb(220,220,220)',
				text: 'Cigarettes'
			},
			{
				nicotineType: 'smokeless',
				color: 'rgb(255,130,188)',
				text: 'Smokeless Tobacco'
			},
			{
				nicotineType: 'cigar',
				color: 'rgb(142, 209, 79)',
				text: 'Cigars'
			},
			{
				nicotineType: 'lozenge',
				color: 'rgb(151,187,205)',
				text: 'Nicotine Lozenges'
			}
		];

		var legend = document.getElementById('nicotineTypesLegend');

		for (var i = 0; i < legendInfos.length; i++){
			//console.log('check it: ' + JSON.stringify(nicotineTypes));
			if (nicotineTypes.includes(legendInfos[i].nicotineType)){
				var legendRow = document.createElement('div');
				legendRow.style.marginBottom = '10px';

				var labelColor = document.createElement('span');
				labelColor.setAttribute('class', 'label');
				labelColor.style.backgroundColor = legendInfos[i].color;
				labelColor.style.color = 'transparent';
				labelColor.style.borderRadius = '5px';
				labelColor.innerHTML = '_';

				var labelText = document.createElement('span');
				labelText.style.marginLeft = '10px';
				labelText.innerHTML = legendInfos[i].text;

				legendRow.appendChild(labelColor);
				legendRow.appendChild(labelText);
				legend.appendChild(legendRow);
			}
		}

		// <div class="legendRow">
	 //      <span class="label label-success keyLabel successColorLabel">_</span>
	 //      <span>= Money Saved</span>
	 //    </div>

		// 	if (nicotineTypes.includes('lozenge')){
		// 	console.log('num 4');
		// 	datasetList.push({
	 //            label: "Nicotine lozenges used",
	 //            fillColor: "rgba(151,187,205,0.2)",
	 //            strokeColor: "rgba(151,187,205,1)",
	 //            pointColor: "rgba(151,187,205,1)",
	 //            pointStrokeColor: "#fff",
	 //            pointHighlightFill: "#fff",
	 //            pointHighlightStroke: "rgba(151,187,205,1)",
	 //            data: chartAxisData.usageData['lozenge'] 
	 //        });
		// }

		$scope.chartTimespan = 'week';
		resetNicotineHistoryChart();

		$scope.roundToTwoPlaces = function(value){
			return roundToTwoPlaces(value);
		};
		$scope.updateChart = function(){
			auth.updateDashboard();
			resetNicotineHistoryChart();
		};

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

			if ($scope.user.username === 'particles' && $scope.user.password === 'particles'){
				window.location = '#/particles';
				var siteNav = document.getElementById('siteNav');
				var accountNav = document.getElementById('accountNav');
				var mainContentArea = document.getElementById('mainContentArea');
				siteNav.style.display = 'none';
				accountNav.style.display = 'none';
				mainContentArea.setAttribute('class', 'col-md-12');
			}
			else {
				auth.logIn($scope.user).error(function(error){
					$scope.errors.push(error.message);
				}).then(function(){
					$scope.errors = [];
					nav.setActive('dashboardLink');
					$state.go('dashboard');
				});
			}
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

		$scope.areMilestonesEnabled = function(){
			return auth.areMilestonesEnabled();
		};
	}
]);

app.controller('StoryCtrl', [
	'$scope',
	'$sce',
	'story',
	function($scope, $sce, story){
		$scope.story = story;
		$scope.storyText = $sce.trustAsResourceUrl(story.storyUri);
	}
]);

app.controller('StoriesCtrl', [
	'$scope',
	'storyInfos',
	'stories',
	function($scope, storyInfos, stories){
		$scope.stories = storyInfos;
		$scope.listViewStories = [];
		for (var i = 3; i < storyInfos.length; i++){
			$scope.listViewStories.push(storyInfos[i]);
		}

		$scope.isAtEndOfStories = false;
		$scope.lastIndex = $scope.listViewStories.length - 1;
		$scope.earliestID = $scope.listViewStories[$scope.listViewStories.length - 1]._id;

		$scope.getMoreStories = function(){
			//var lastIndex = $scope.listViewStories.length - 1;
			//var updatedStories = [];
			//console.log('damn: ' + $scope.lastIndex + ' ' + $scope.earliestID + ' ' + !$scope.isAtEndOfStories);
			if ($scope.earliestID && !$scope.isAtEndOfStories && !$scope.isInRequest){
				//console.log('fuck yesm');
				$scope.isInRequest = true;
				stories.getMoreStories($scope.earliestID, 
					function(newStories){
						if (newStories.length === 0){
							$scope.isAtEndOfStories = true;
						}
						else {
							$scope.lastIndex += newStories.length;
							$scope.earliestID = newStories[newStories.length - 1]._id;
							$scope.isInRequest = false;
						} //$scope.listViewStories.push(newStories);

						for (var i = 0; i < newStories.length; i++){
							var storyLink = document.createElement('a');
							storyLink.setAttribute('ng-click', 'setActive(\'none\')');
							storyLink.setAttribute('ng-href', '#/stories/' + newStories[i]._id);
							storyLink.setAttribute('href', '#/stories/' + newStories[i]._id);
							storyLink.text = newStories[i].title;

							var lineBreak = document.createElement('hr');
							lineBreak.setAttribute('class', 'storyBreak');

							var container = document.createElement('div');
							container.setAttribute('class', 'listStoryArea');
							container.appendChild(storyLink);
							container.appendChild(lineBreak);

							var storiesListView = document.getElementById('storiesListView');
							storiesListView.appendChild(container);
						}
					}
				);
			}
		}
		$scope.noStoriesRemaining = function(){
			return $scope.isAtEndOfStories;
		}
	}
]);

app.controller('profileCtrl', [
	'$scope',
	'$http',
	'$window',
	'auth',
	'userInfo',
	function($scope, $http, $window, auth, userInfo){
		//userInfo.getprofile

		$scope.profileCallback = function(profileInfo){
			$scope.cigarettePrice = profileInfo.cigarettePrice;
			$scope.dipPrice = profileInfo.dipPrice;
			$scope.cigarPrice = profileInfo.cigarPrice;
			$scope.dateQuit = profileInfo.dateQuit; //new Date(profileInfo.dateQuit);
			$scope.infoMessage = profileInfo.infoMessage;
			$scope.errorMessage = profileInfo.errorMessage;

			$scope.financialGoalTitle = (profileInfo.financialGoalItem ?
				"My Financial Goal" : "Add a financial goal");
			$scope.financialGoalButtonText = (profileInfo.financialGoalItem ?
				"Update" : "Add");
			$scope.financialGoalItem = profileInfo.financialGoalItem;
			$scope.financialGoalCost = profileInfo.financialGoalCost;
		};
		
		userInfo.getprofile(auth.getToken(), $scope.profileCallback);

		$scope.updateProfile = function(){
			var date = $scope.dateQuit.date;
			date.setSeconds(0);
			date.setMilliseconds(0);
			date.setMinutes($scope.dateQuit.time.getMinutes());
			date.setHours($scope.dateQuit.time.getHours());

			var updateData = {
				cigarettePrice: $scope.cigarettePrice,
				dipPrice: $scope.dipPrice,
				cigarPrice: $scope.cigarPrice,
				dateQuit: date,

				financialGoalItem: $scope.financialGoalItem,
				financialGoalCost: $scope.financialGoalCost,

				token: auth.getToken()
			};

			if ($scope.usageInfos[0].quantity !== 0){
				updateData.nicotineUsages = $scope.usageInfos;
			}

			$http.post("/updateProfile", updateData).success(function(updateInfo){
				$scope.errorMessage = null;
				$scope.infoMessage = updateInfo.message;
				window.scrollTo(0, 0);
				auth.updateDashboard();
			}).error(function(err){
				$scope.infoMessage = null;
				$scope.errorMessage = err.message;
				$window.scrollTo(0, 0);
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

		addLinksToPost($scope.topic);

		$scope.isCreatingComment = {};

		var comments = topicInfo.topic.comments;

		var moreComments = [];

		for (var i = 0; i < comments.length; i++){
			var nextComment = comments[i];

			var finalDate = new Date(nextComment.date_created);
			var timeSinceCreated = $moment(finalDate).fromNow();

			addLinksToPost(nextComment);

			nextComment.timeSincePosted = timeSinceCreated;
			moreComments.push(nextComment);

			var moreSubComments = [];

			for (var j = 0; j < nextComment.comments.length; j++){
				var subComment = nextComment.comments[j];

				finalDate = new Date(nextComment.date_created);
				timeSinceCreated = $moment(finalDate).fromNow();

				addLinksToPost(subComment);

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
			$scope.newComment.content += ' ' + USER_LINK_TEMPLATE;
		};
		$scope.cancelCommentCreate = function(comment_id){
			if (comment_id){
				$scope.isCreatingComment[comment_id] = false;
			} 
			else {
				$scope.isCreatingComment['topic'] = false;
			}

			$scope.newComment.title = '';
			$scope.newComment.content = '';
		};
		$scope.createComment = function(post_id){
			forumService.createComment(post_id, auth, $scope.newComment, function(author, id){
				var createdComment = {
					_id: id,
					title: $scope.newComment.title,
					content: $scope.newComment.content,
					comments: [],
					creator: author,
					timeSincePosted: 'a few seconds ago'
				}
				$scope.newCommentInit();

				var matchResults = findLinksInText(createdComment.content);
				if (matchResults.matchText){
					createdComment.content = createdComment.content.replace(matchResults.matchText, matchResults.link);
				}

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

app.controller('FeedbackCtrl', [
	'$scope',
	'$http',
	function($scope, $http){
		$scope.feedback = {};
		$scope.errorMessages = [];

		$scope.provideFeedback = function(){
			$scope.errorMessages = [];

			if (!$scope.feedback.summary){
				$scope.errorMessages.push('Your feedback must contain a summary.');
			}
			if (!$scope.feedback.content){
				$scope.errorMessages.push('Your feedback must contain content.');
			}

			if ($scope.errorMessages.length === 0){
				$http.post('/feedback', $scope.feedback).then(function(data){
					$scope.infoMessage = 'Thank you for your feedback! We\'re working hard to improve!';
				});
			}
		}
}]);

app.controller('MilestoneCtrl', [
	'$scope',
	'completedMilestones',
	'milestoneService',
	'auth',
	function($scope, completedMilestones, milestoneService, auth){
		$scope.completedMilestones = completedMilestones;
		$scope.areMilestonesEnabled = function(){
			return auth.areMilestonesEnabled();
		};
}]);

// var DT = 20;
// var effect = null;

// function handleTick(){
//   effect.update(DT);
//   effect.draw();
//   stage.update();
// }

app.controller('ParticlesCtrl', [
	'$scope',
	function($scope){
		// Courtesy of StackOverflow user Tim Down
		function hexToRgb(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    var color = null;

	    if (result){
	    	var r = parseInt(result[1], 16);
		    var g = parseInt(result[2], 16);
		    var b = parseInt(result[3], 16);

		    color = new Color(r, g, b, 255);
	    }

	    return color;
		}

		console.log('aubrey donnelly: ' + RISING_PARTICLES_VALUE + ' ' + EXPANDING_PARTICLES_VALUE);
		$scope.PARTICLE_BEHAVIOR_MAPPINGS = {
		  'rising': ParticleBehavior.RISING,
		  'expanding': ParticleBehavior.EXPANDING
		};

		$scope.isControlsAreaVisible = false;
		$scope.expandingValue = EXPANDING_PARTICLES_VALUE;
		$scope.risingValue = RISING_PARTICLES_VALUE;

		$scope.isControlsVisible = function(){
			return $scope.isControlsAreaVisible;
		};

		$scope.toggleControls = function(){
			var controlsArea = document.getElementById('particleControls');
			controlsArea.style.display = $scope.isControlsAreaVisible ?
				'none' :
				'block';
			var toggleLink = document.getElementById('toggleControlsLink');
			toggleLink.innerHTML = $scope.isControlsAreaVisible ?
				'Show Controls' :
				'Hide Controls';

			$scope.isControlsAreaVisible = !$scope.isControlsAreaVisible;
		};

		$scope.backToSite = function(){
			createjs.Ticker.removeEventListener('tick', handleTick);
			effect.destroy();

			var siteNav = document.getElementById('siteNav');
			var accountNav = document.getElementById('accountNav');
			var mainContentArea = document.getElementById('mainContentArea');
			siteNav.style.display = 'block';
			accountNav.style.display = 'block';
			mainContentArea.setAttribute('class', 'col-md-6');
		};

		$scope.updateParticles = function(){
			var baseColor = hexToRgb($scope.color);
		  var colorChangeParts = [];
		  if (baseColor.red > COLOR_DOMINANCE_THRESHOLD){
		  	colorChangeParts.push(ColorPart.RED);
		  }
		  if (baseColor.green > COLOR_DOMINANCE_THRESHOLD){
		  	colorChangeParts.push(ColorPart.GREEN);
		  }
		  if (baseColor.blue > COLOR_DOMINANCE_THRESHOLD){
		  	colorChangeParts.push(ColorPart.BLUE);
		  }
		  console.log('huh ' + document.getElementById('behaviorControl').value);
		  var particleCount = PARTICLE_COUNT_MAPPINGS[document.getElementById('countControl').value];
		  var particleSize = PARTICLE_SIZE_MAPPINGS[document.getElementById('sizeControl').value];
		  var speedRange = PARTICLE_SPEED_MAPPINGS[document.getElementById('speedControl').value];
		  var airResistance = AIR_RESISTANCE_MAPPINGS[document.getElementById('resistanceControl').value];
		  var windSpeed = WIND_MAPPINGS[document.getElementById('windControl').value];
		  var behavior = $scope.PARTICLE_BEHAVIOR_MAPPINGS[document.getElementById('behaviorControl').value];
		  console.log('double huh ' + $scope.PARTICLE_BEHAVIOR_MAPPINGS['expanding'] + ' --- ' + $scope.PARTICLE_BEHAVIOR_MAPPINGS[document.getElementById('behaviorControl').value] + ' *** ' + behavior);
		  effect.destroy();
		  effect = new MouseParticleEffect(particleCount, baseColor, colorChangeParts, particleSize, 1.5,
		    speedRange, airResistance, windSpeed, behavior, stage, canvas);
		};
}]);
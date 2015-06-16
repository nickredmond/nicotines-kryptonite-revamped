var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var User = mongoose.model('User');
var Story = mongoose.model('Story');
var Dashboard = mongoose.model('Dashboard');
//Story.remove({}); // removes all Stories
var TobaccoPricing = mongoose.model('TobaccoPricing');
var NicotineUsage = mongoose.model('NicotineUsage');

var Forum = mongoose.model('Forum');
var Post = mongoose.model('Post');

var nicotineTypeMappings = {};
nicotineTypeMappings["Cigarettes"] = "cigarette";
nicotineTypeMappings["Smokeless Tobacco"] = "smokeless";
nicotineTypeMappings["Cigars"] = "cigar";
nicotineTypeMappings["Nicotine Gum"] = "gum";
nicotineTypeMappings["Nicotine Lozenges"] = "lozenge";
nicotineTypeMappings["Nicotine Patches"] = "patch";
nicotineTypeMappings["Electronic Cigarettes"] = "ecig";

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

function isOneOrMoreTypeSelected(request){
	return ((request.body.cigarettesPerDay && request.body.cigaretteBrand) || 
		(request.body.dipsPerDay && request.body.dipBrand) || 
		(request.body.cigarsPerDay && request.body.cigarBrand));
}

function isUserFieldTaken(query, errorMessage, callback){
	var errorMessages = null;

	query.exec(function(err, users){
		if (users.length > 0){
			errorMessages = [errorMessage];
			callback(errorMessages); //next(new Error("That username has already been taken"));
		}
	});
}

router.post('/register', function(request, response, next){
	var errorMessages = [];
	var NUMBER_PATTERN = /^\d+$/;
	var MIN_USERNAME_LENGTH = 6;
	var EMAIL_PATTERN = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
	var MIN_PASSWORD_LENGTH = 8;
	var MAX_PASSWORD_LENGTH = 50;
	var PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/; // change to include constants
	var CAPITAL_LETTER_PATTERN = /^(?=.*[A-Z]).{8,50}$/;
	var LOWERCASE_LETTER_PATTERN = /^(?=.*[a-z]).{8,50}$/;
	var ONE_NUMBER_PATTERN = /^(?=.*\d).{8,50}$/;

	if (!request.body.username){
		errorMessages.push("Username is required");
	}
	else if (request.body.username.length < MIN_USERNAME_LENGTH){
		errorMessages.push("Username must be at least " + MIN_USERNAME_LENGTH + " characters");
	}

	if (!request.body.email){
		errorMessages.push("Email address is required");
	}
	else if (!EMAIL_PATTERN.test(request.body.email)){
		errorMessages.push("Email address is invalid");
	}

	if (!request.body.password){
		errorMessages.push("Password is required")
	}
	else if (!PASSWORD_PATTERN.test(request.body.password)){
		if (request.body.password.length < MIN_PASSWORD_LENGTH ||
			request.body.password.length > MAX_PASSWORD_LENGTH){
			errorMessages.push("Password must be between " + MIN_PASSWORD_LENGTH + " and " +
				MAX_PASSWORD_LENGTH + " characters");
		}
		else {
			if (!CAPITAL_LETTER_PATTERN.test(request.body.password)){
				errorMessages.push("Password must contain at least one uppercase letter");
			}
			if (!LOWERCASE_LETTER_PATTERN.test(request.body.password)){
				errorMessages.push("Password must contain at least one lowercase letter");
			}
			if (!ONE_NUMBER_PATTERN.test(request.body.password)){
				errorMessages.push("Password must contain at least one number");
			}
		}
	}

	if (!request.body.name){
		errorMessages.push("Your name is required");
	}
	if (!request.body.stateOfResidence){
		errorMessages.push("Please tell us where you live")
	}
	if (!request.body.birthdate){
		errorMessages.push("Birth date is required");
	}
	if (!request.body.quittingMethod){
		errorMessages.push("Please tell us how you plan on quitting");
	}

	if (!isOneOrMoreTypeSelected(request)){
		errorMessages.push("Please select at least one form of tobacco you use");
	}
	else if ((request.body.dipsPerDay && !NUMBER_PATTERN.test(request.body.dipsPerDay)) ||
		(request.body.cigarettesPerDay && !NUMBER_PATTERN.test(request.body.cigarettesPerDay)) ||
		(request.body.cigarsPerDay && !NUMBER_PATTERN.test(request.body.cigarsPerDay))){
		errorMessages.push("The amount of tobacco you use per day must be a number");
	}

	if (errorMessages.length > 0){
		return response.status(400).json({messages: errorMessages});
	}

	var user = new User();
	user.name = request.body.name;
	user.username = request.body.username;
	user.email = request.body.email;
	user.birthdate = request.body.birthdate;
	user.stateOfResidence = request.body.stateOfResidence;
	user.quittingMethod = request.body.quittingMethod;

	//-- handle if user doesn't use a certain type --//
	user.cigarettesPerDay = request.body.cigarettesPerDay;
	user.dipsPerDay = request.body.dipsPerDay;
	user.cigarsPerDay = request.body.cigarsPerDay;
	user.cigaretteBrand = request.body.cigaretteBrand;
	user.dipBrand = request.body.dipBrand;
	user.cigarBrand = request.body.cigarBrand;

	user.setPassword(request.body.password);

	var dashboard = new Dashboard();
	dashboard.milestones = [];
	dashboard.dateQuit = new Date();
	dashboard.save();

	user.dashboard = dashboard;

	var tobaccoType = null;
	if (request.body.nrtBrand){
		var AMOUNT_GIVEN_LENGTH = 3;

		var brandTokens = request.body.nrtBrand.split('-');

		if (brandTokens.length === AMOUNT_GIVEN_LENGTH){
			user.nrtBrand = brandTokens[0].trim() + " - " + brandTokens[1].trim();
			user.amountPerUnit = parseInt(brandTokens[2].trim().split(' ')[0]);
		}
		else {
			user.nrtBrand = brandTokens.join("-").trim();
		}

		tobaccoType = nicotineTypeMappings[user.quittingMethod];
	}

	TobaccoPricing.find({'state': user.stateOfResidence})
		.where('brandName').in([user.cigaretteBrand, user.dipBrand, user.cigarBrand, user.nrtBrand])
		.exec(function(err, tobaccoPricings){
			for (var i = 0; i < tobaccoPricings.length; i++){
				var nextPricing = tobaccoPricings[i];

				if (user.cigaretteBrand && nextPricing.tobaccoType === 'cigarette' &&
					 user.cigaretteBrand === nextPricing.brandName) {
					user.cigarettePrice = nextPricing.averagePrice;
				}
				else if (user.dipBrand && nextPricing.tobaccoType === 'smokeless' &&
						user.dipBrand === nextPricing.brandName){
					user.dipPrice = nextPricing.averagePrice;
				}
				else if (user.cigarBrand && nextPricing.tobaccoType === 'cigar' &&
						user.cigarBrand === nextPricing.brandName){
					user.cigarPrice = nextPricing.averagePrice;
				}
				else if (user.nrtBrand && nextPricing.tobaccoType === tobaccoType &&
						user.nrtBrand === nextPricing.brandName &&
						(user.amountPerUnit === parseInt(nextPricing.amountPerUnit))){
					user.nrtPricing = nextPricing;
				}
			}

			user.save(function(err){
				if (err) { console.log('martin'); return next(err); }
				return handleLogin(user, response, next, null);
			});
		});

	/**
		nrtBrand syntax: Equate - 4mg - 24 ct.
						 brandName [- strength [- # ct.]]
	*/
});

router.param('story', function(request, response, next, id){
	var query = Story.findById(id);

	query.exec(function(err, story){
		if (err) { return next(err); }
		if(!story) { return next(new Error('can\'t find story')); }

		request.story = story;
		return next();
	});
});

//--- DEV URL - COMMENT OUT WHEN NOT IN USE ---//
// router.post('/newStory', function(request, response, next){
// 	Story.create({title: request.body.title,
// 				  summary: request.body.summary,
// 				  imageUri: request.body.imageUri,
// 				  storyUri: request.body.storyUri,
// 				  isTopStory: request.body.isTopStory
// 				 }, 
// 		function(err, story){
// 			if (err) { return next(err); }
// 			response.json({story: story});
// 	});	
// });

//--- DEV URL - COMMENT OUT WHEN NOT IN USE ---//
// router.post('/newTobaccoPricing', function(request, response, next){
// 	TobaccoPricing.create({
// 		tobaccoType: request.body.tobaccoType,
// 		brandName: request.body.brandName,
// 		state: request.body.state,
// 		averagePrice: request.body.averagePrice
// 	}, function(err, tobaccoPricing){
// 		if (err) { return next(err); }
// 		response.json({tobaccoPricing: tobaccoPricing});
// 	});
// });

router.get('/topStory', function(request, response, next){
	Story.findOne({'isTopStory': true})
		.limit(1)
		.exec(function(err, story){
			if (err) { return next(err); }
			return response.json({story: story});
		});
});

router.get('/stories/:story', function(request, response){
	response.json(request.story);
});

function daysSinceQuit(dateQuit){
	var difference = new Date().getTime() - dateQuit.getTime();

	var days = Math.floor(difference / (1000 * 60 * 60 * 24));
 	difference -= days * (1000 * 60 * 60 * 24);
 	
 	var hours = Math.floor(difference / (1000 * 60 * 60));
 	days += (hours / 24);
 	difference -= hours * (1000 * 60 * 60);

 	var minutes = Math.floor(difference / (1000 * 60));
 	days += (minutes / (24 * 60));
 	difference -= minutes * (1000 * 60);

 	return days;
}

function calculateCravingLevel(user){
 	var cravingLevel = 0;
 	var maxCravingValue = 3.2;

 	var days = daysSinceQuit(user.dashboard.dateQuit);
 	var normalizedDays = days / 2;

 	if (normalizedDays < 0.83){
 		cravingLevel = 2.867 * normalizedDays;
 	}
 	else if (normalizedDays >= 0.83 && normalizedDays < 2.58){
 		cravingLevel = ((-1 * ((2 * Math.pow(normalizedDays, 2)) - (8 * normalizedDays) + 5)) / Math.pow(normalizedDays, 2)) + 2;
 	}
 	else if (normalizedDays >= 2.58 && normalizedDays < 147.02){
 		cravingLevel = (Math.pow((0.005 * normalizedDays) -2, 2)) - 1.6;
 	}
 	else cravingLevel = 0;

 	return (cravingLevel / maxCravingValue) * 100;
}

function handleLogin(user, response, next, info){
	if (user){
			var token = user.generateJWT();
			user.token = token;

			user.save(function(err){
				if (err) { return next(err); }

				var hasFinancialGoal = user.dashboard.financialGoal;
				
				return response.json({
					token: user.generateJWT(),
					dashboard: {
						greeting: "Welcome",
						firstName: user.name,
						subgreeting: "You can do this!",
						financialGoalCost: (hasFinancialGoal ? user.dashboard.financialGoalCost : -1),
						moneySaved: calculateMoneySaved(user),
						cravingLevel: calculateCravingLevel(user)
					}
				});
			});
	} else {
		return response.status(401).json(info);
	}
}

function calculateMoneySaved(user){
	var CIGARETTES_PER_PACK = 20;
	var DIPS_PER_CAN = 8;
	//var LOZENGES_PER_BOTTLE = 24;
	//var GUM_PIECES_PER_PACK = 20;
	//var PATCHES_PER_CARTON = 24;

	var daysQuit = daysSinceQuit(user.dashboard.dateQuit);
	var grossCost = 0;
	var actualCost = 0;

	if (user.cigaretteBrand) {
		grossCost += user.cigarettePrice * (user.cigarettesPerDay / CIGARETTES_PER_PACK) * daysQuit;
	}
	if (user.dipBrand){
		grossCost += user.dipPrice * (user.dipsPerDay / DIPS_PER_CAN) * daysQuit;
	}
	if (user.cigarBrand){
		grossCost += user.cigarPrice * user.cigarsPerDay * daysQuit;
	}

	// calculate how money the user actually spent (netCost)
	for (var i = 0; i < user.nicotineUsages.length; i++){
		var usageInfo = user.nicotineUsages[i];

		if (usageInfo.nicotineType === 'cigarette'){
			var hotPotato = (usageInfo.quantityUsed / CIGARETTES_PER_PACK) * user.cigarettePrice;
			actualCost += (usageInfo.quantityUsed / CIGARETTES_PER_PACK) * user.cigarettePrice;
		}
		else if (usageInfo.nicotineType === 'smokeless'){
			var coldPotato = (usageInfo.quantityUsed / DIPS_PER_CAN) * user.dipPrice;
			actualCost += (usageInfo.quantityUsed / DIPS_PER_CAN) * user.dipPrice;
		}
		else if (usageInfo.nicotineType === 'cigar'){
			var colderPotato = usageInfo.quantityUsed * user.cigarPrice;
			actualCost += usageInfo.quantityUsed * user.cigarPrice; 
		}
		else if (usageInfo.nicotineType in ['ecig', 'gum', 'patch', 'lozenge']){
			actualCost += (usageInfo.quantityUsed / user.nrtPricing.amountPerUnit) * user.nrtPricing.averagePrice;
		}
	}
	return (grossCost - actualCost);
}	

router.post('/dashboard', function(request, response, next){
	authenticationMethod = request.body.token ? 'token' : 'local'
	var isUserMissingFields = function(authMethod, req){
		return (authMethod === 'local') ? 
			(!(req.body.username || req.body.email) || !req.body.password) :
			!req.body.token;
	};

	if (isUserMissingFields(authenticationMethod, request)) {
		return response.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate(authenticationMethod, function(err, user, info){
		if (err) {
			return (authenticationMethod === 'token') ? 
				response.status(400).json({message: "Could not authenticate. Please log in again."}) :
				next(err);
		}
		else return handleLogin(user, response, next, info);
	})(request, response, next);
});

router.post('/tobaccoCost', function(request, response, next){
	if (!request.body.token){
		return response.status(400).json({message: "Could not authenticate user. Please log in again."});
	}

	passport.authenticate('token', function(err, user, info){
		if (err){
			return next(err);
		}
		else {
			var userMessage = user.hasUpdatedTobaccoCost ? null :
					"We have pre-populated the amount you spend on tobacco based on our best guess. " +
					"Feel free to change the amounts so they are more accurate.";

			var userInfo = {
				dateQuit: user.dashboard.dateQuit,
				cigarettePrice: user.cigarettePrice,
				dipPrice: user.dipPrice,
				cigarPrice: user.cigarPrice,
				infoMessage: userMessage,
				financialGoalItem: user.dashboard.financialGoal,
				financialGoalCost: user.dashboard.financialGoalCost
			};

			return response.status(200).json(userInfo);
		}
	})(request, response, next);
});

function authenticateWithToken(request, response, next, callback){
	if (!request.body.token){
		return response.status(403).json({message: "Could not authenticate user. Please log in again."});
	}

	passport.authenticate('token', function(err, user, info){
		if (err){
			return next(err);
		}
		else {
			return callback(user, info);
		}
	})(request, response, next);
}

router.post('/updateTobaccoCost', function(request, response, next){
	var PRICE_PATTERN = /^\d+(?:\.\d{1,2})?$/;
	var hasSentResponse = false;

	var sendResponse = function(status, message){
		if (!hasSentResponse){
			hasSentResponse = true;
			return response.status(status).json({message: message});
		}
	};
	var isUpdatingDateQuit = function(req, user){
		return (req.body.dateQuit && (req.body.dateQuit !== user.dashboard.dateQuit));
	};
	var isUpdatingFinancialGoal = function(req, user){
		return (req.body.financialGoalItem && req.body.financialGoalCost);
	};

	return authenticateWithToken(request, response, next, function(user, info){
		var isUpdatingTobaccoPrices = false;

		if (request.body.cigarettePrice){
			if (!PRICE_PATTERN.test(request.body.cigarettePrice)){
				return sendResponse(400, "Cigarette price must be a currency value (e.g. '2.31' or '2')");
			}
			else {
				isUpdatingTobaccoPrices = true;
				user.setCigarettePrice(request.body.cigarettePrice);
			}
		}
		if (request.body.dipPrice){
			if (!PRICE_PATTERN.test(request.body.dipPrice)){
				return sendResponse(400, "Smokeless tobacco price must be a currency value (e.g. '4.87' or '5')");
			}
			isUpdatingTobaccoPrices = true;
			user.setDipPrice(request.body.dipPrice);
		}
		if (request.body.cigarPrice){
			if (!PRICE_PATTERN.test(request.body.cigarPrice)){
				return sendResponse(400, "Cigar price must be a currency value (e.g. '3.90' or '3.9')");
			}
			else {
				isUpdatingTobaccoPrices = true;
				user.setCigarPrice(request.body.cigarPrice);
			}
		}
		if (isUpdatingDateQuit(request, user)){
			user.dashboard.dateQuit = request.body.dateQuit;
			user.dashboard.save(function(error){
				if (error) {return next(error); }
			});
		}
		if (isUpdatingFinancialGoal(request, user)){
			if (!PRICE_PATTERN.test(request.body.financialGoalCost)){
				return sendResponse(400, "Financial goal cost must be a currency value (e.g. '150' or '1532.47')");
			}
			else {
				user.dashboard.financialGoal = request.body.financialGoalItem;
				user.dashboard.financialGoalCost = request.body.financialGoalCost;
				user.dashboard.save(function(error){
					if (error) {return next(error);}
				});
			}
		}
		if (request.body.nicotineUsages){
			for (var i = 0; i < request.body.nicotineUsages.length; i++){
				var usageInfo = request.body.nicotineUsages[i];
				usageInfo.nicotineType = nicotineTypeMappings[usageInfo.nicotineType];

				NicotineUsage.create({
					dateUsed: usageInfo.date,
					nicotineType: usageInfo.nicotineType,
					quantityUsed: usageInfo.quantity
				}, function(err, usage){
					if (err) { return next(err); }

					user.nicotineUsages.push(usage);
					user.save(function(err, user){
						if (err) {return next(err);}
					});
				});
			}
		}


		user.save(function(err){
			if (err) { return next(err); }

			sendResponse(200, "Your information has been updated!");
		});
	});
});

router.get('/nrtBrands', function(request, response, next){
	var quittingMethod = request.query.quittingMethod;

	if (nicotineTypeMappings[quittingMethod]){
		TobaccoPricing.find({
			state: 'UT',
			tobaccoType: nicotineTypeMappings[quittingMethod],
		}).exec(function(err, tobaccoPricings){
			var brandNames = [];
			for (var i = 0; i < tobaccoPricings.length; i++){
				var brandName = tobaccoPricings[i].brandName;
				if (tobaccoPricings[i].amountPerUnit){
					brandName += " - " + tobaccoPricings[i].amountPerUnit + " ct.";
				}

				brandNames.push(brandName);
			}

			return response.json({brandNames: brandNames});
		});
	}
	else {
		return response.json({brandNames: null});
	}
});

function forumIndex(isAuthenticated, response, next){
	Forum.find().deepPopulate('topics.comments').exec(function(err, forums){
		if (err){ return next(err); }

		var forumInfos = [];

		for (var i = 0; i < forums.length; i++){
			var nextForum = forums[i];
			var nextInfo = populateForum(nextForum);
			forumInfos.push(nextInfo);
		}

		var responseData = {
			forumInfos: forumInfos,
			isUserAuthenticated: isAuthenticated
		};
		return response.status(200).json(responseData);
	});
}

function populateForum(forum){
	var numberPosts = 0;
	var latestPost = {
		date: null,
		author: null
	}

	for (var j = 0; j < forum.topics.length; j++){
		numberPosts += 1;
		var nextTopic = forum.topics[j];
		if (!latestPost.date || latestPost.date < nextTopic.date_created){
			latestPost.date = nextTopic.date_created;
			latestPost.author = nextTopic.creator;
		}

		for (var k = 0; k < nextTopic.comments.length; k++){
			numberPosts += 1;
			var nextComment = nextTopic.comments[k];

			if (latestPost.date < nextComment.date_created){
				latestPost.date = nextComment.date_created;
				latestPost.author = nextComment.creator;
			}

			if (nextComment.comments.length > 0){
				for (var l = 0; l < nextComment.comments.length; l++){
					numberPosts += 1;
					var nextReply = nextComment.comments[l];

					if (latestPost.date < nextReply.date_created){
						latestPost.date = nextReply.date_created;
						latestPost.author = nextReply.creator;
					}
				}
			}
		}
	}

	latestPost = latestPost.author ? latestPost : null;

	var nextInfo = {
		_id: forum._id,
		title: forum.title,
		numberTopics: forum.topics.length,
		numberPosts: numberPosts,
		latestPost: latestPost
	};
	
	return nextInfo;
}

router.post('/forum', function(request, response, next){
	if (request.body.token){
		authenticateWithToken(request, response, next, function(user, info){
			forumIndex(true, response, next);
		});
	} else {
		forumIndex(false, response, next);
	}
});

// router.get('/stories/:story', function(request, response){
// 	response.json(request.story);
// });

router.param('forum', function(request, response, next, id){
	var query = Forum.findById(id).deepPopulate('topics.comments');

	query.exec(function(err, forum){
		if (err) { return next(err); }
		if (!forum) { return next(new Error('can\'t find forum')); }

		request.forum = forum;
		return next();
	});
});

function forumPage(isUserAuthenticated, forum, response, next){
	var topics = [];

	for (var j = 0; j < forum.topics.length; j++){
		var nextTopic = forum.topics[j];
		var numberReplies = 0;
		var latestPost = {
			date: null,
			author: null
		}

		for (var k = 0; k < nextTopic.comments.length; k++){
			numberReplies += 1;
			var nextComment = nextTopic.comments[k];

			if (latestPost.date < nextComment.date_created){
				latestPost.date = nextComment.date_created;
				latestPost.author = nextComment.creator;
			}

			if (nextComment.comments.length > 0){
				for (var l = 0; l < nextComment.comments.length; l++){
					numberReplies += 1;
					var nextReply = nextComment.comments[l];

					if (latestPost.date < nextReply.date_created){
						latestPost.date = nextReply.date_created;
						latestPost.author = nextReply.creator;
					}
				}
			}
		}

		var topicInfo = {
			_id: nextTopic._id,
			title: nextTopic.title,
			numberReplies: numberReplies,
			latestPost: latestPost
		};
		topics.push(topicInfo);
	}

	response.json({ 
		_id: forum._id,
		title: forum.title, 
		topics: topics,
		isUserAuthenticated: isUserAuthenticated 
	});
}

router.post('/forums/:forum', function(request, response, next){
	var forum = request.forum;

	if (request.body.token){
		authenticateWithToken(request, response, next, function(user, info){
			forumPage(true, forum, response);
		});
	} else {
		forumPage(false, forum, response);
	}

});

router.post('/forum/topics/create', function(request, response, next){
	if (!request.body.topic){
		return response.status(400).json({message: 'No topic data received.'});
	}
	else if (!request.body.token){
		return response.status(401).json({message: 'Must be logged in to post new content.'});
	}
	else authenticateWithToken(request, response, next, function(user, info){
		var topic = request.body.topic;

		Post.create({
			title: topic.title,
			content: topic.content,
			creator: user.username,
			date_created: new Date()
		})

		var post = new Post();
		post.title = topic.title;
		post.content = topic.content;
		post.creator = user.username;
		post.date_created = new Date();

		post.save(function(err){
			if (err){ return next(err); }

			Forum.findById(request.body.forum_id).exec(function(err, forum){
				forum.topics.push(post);
				forum.save(function(err){
					if (err) {return next(err);}
					response.status(200).json({topic_id: post._id});
				});
			});
		});
	});
});

router.param('topic', function(request, response, next, id){
	var query = Post.findById(id).deepPopulate('comments.comments');

	query.exec(function(err, topic){
		if (err){return next(err);}
		if (!topic){return next(new Error('can\'t find topic'));}

		request.topic = topic;
		return next();
	})
});

router.post('/forum/topics/:topic', function(request, response, next){
	if (request.body.token){
		authenticateWithToken(request, response, next, function(user, info){
			response.json({isUserAuthenticated: true, topic: request.topic});
		});
	} else {
		response.json({isUserAuthenticated: false, topic: request.topic});
	}
});

router.post('/forum_topic/comments/new_comment', function(request, response, next){
	if (!(request.body.comment && request.body.post_id)){
		return response.status(400).json({message: 'Invalid data received.'});
	}
	else if (!request.body.token){
		return response.status(401).json({message: 'Must be logged in to post new content.'});
	}
	else authenticateWithToken(request, response, next, function(user, info){
		var query = Post.findById(request.body.post_id).populate('comments');
		query.exec(function(err, post){
			if (err) {return next(err);}

			var comment = new Post();
			comment.title = request.body.comment.title;
			comment.content = request.body.comment.content;
			comment.creator = user.username;
			comment.date_created = new Date();

			comment.save(function(err){
				if (err) {return next(err);}

				post.comments.push(comment);
				post.save(function(err){
					if (err) {return next(err);}
				});
			});
		});

		return response.json({author: user.username});
	});
});

router.get('/version', function(request, response, next){
	return response.json({version: /*null*/ '- ALPHA'});
});

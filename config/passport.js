var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var LocalStrategy = require('passport-local').Strategy;
var TokenStrategy = require('passport-accesstoken').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done){
		var criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username};
		User.findOne(criteria)
			.populate('dashboard')
			.populate('nicotineUsages')
			.populate('nrtPricing')
			.exec(function(err, user){
				if (err) {console.log(err.errors); return done(err); }
				if(!user){
					usernameError = (username.indexOf('@') === -1) ? 'Incorrect username' : 'Incorrect email address';
					return done(null, false, {message: usernameError});
				}
				if(!user.isValidPassword(password)){
					return done(null, false, {message: 'Incorrect password'});
				}

				return done(null, user);
		});
	}
));

passport.use(new TokenStrategy(
	function(token, done){
		var criteria = {token: token};
		User.findOne(criteria)
			.populate('dashboard')
			.populate('nicotineUsages')
			.populate('nrtPricing')
			.exec(function(err, user){
				if (err) {return done(err);}
				if (!user){
					return done(null, false, {message: "Invalid authentication token. Please log in again."});
				}
				return done(null, user);
		});
	}
));
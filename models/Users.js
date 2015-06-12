var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	email: {type: String, unique: true},
	hash: String,
	salt: String,
	token: String,
	name: String,
	hasUpdatedTobaccoCost: {type: Boolean, default: false},
	stateOfResidence: String,
	birthdate: Date,
	quittingMethod: String,
	cigarettesPerDay: {type: Number, default: 0},
	dipsPerDay: {type: Number, default: 0},
	cigarsPerDay: {type: Number, default: 0},
	cigaretteBrand: {type: String, null: true},
	dipBrand: {type: String, null: true},
	cigarBrand: {type: String, null: true},

	cigarettePrice: {type: Number, default: 0},
	dipPrice: {type: Number, default: 0},
	cigarPrice: {type: Number, default: 0},
	gumPrice: {type: Number, default: 0},
	patchPrice: {type: Number, default: 0},
	lozengePrice: {type: Number, default: 0},
	ecigPrice: {type: Number, default: 0},

	gumPiecesPerPack: {type: Number, default: 0},
	patchesPerCarton: {type: Number, default: 0},
	lozengesPerBottle: {type: Number, default: 0},

	// patchPricing: {type: mongoose.Schema.Types.ObjectId, ref: 'TobaccoPricing'},
	// gumPricing: {type: mongoose.Schema.Types.ObjectId, ref: 'TobaccoPricing'},

	dashboard: {type: mongoose.Schema.Types.ObjectId, ref: 'Dashboard'},
	nrtPricing: {type: mongoose.Schema.Types.ObjectId, ref: 'TobaccoPricing', null: true},
	nicotineUsages: [{type: mongoose.Schema.Types.ObjectId, ref: 'NicotineUsage'}]
});

userSchema.methods.setCigarettePrice = function(price){
	this.cigarettePrice = price;
	this.hasUpdatedTobaccoCost = true;
};
userSchema.methods.setDipPrice = function(price){
	this.dipPrice = price;
	this.hasUpdatedTobaccoCost = true;
};
userSchema.methods.setCigarPrice = function(price){
	this.cigarPrice = price;
	this.hasUpdatedTobaccoCost = true;
};

userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
userSchema.methods.isValidPassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};
userSchema.methods.generateJWT = function(){
	var today = new Date();
	var expiration = new Date(today);
	expiration.setDate(today.getDate() + 14); // expires in 14 days

	var token = jwt.sign({
		_id: this._id,
		username: this.username,
		exp: parseInt(expiration.getTime() / 1000)
	}, 'SECRET'); // put the secret elsewhere!

	return token;
};

mongoose.model('User', userSchema);
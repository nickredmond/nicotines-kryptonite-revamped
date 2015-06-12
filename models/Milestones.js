var mongoose = require('mongoose');

var milestoneSchema = new mongoose.Schema({
	dateCompleted: {type: Date, null: true},
	milestoneText: String,
	quittingMethod: String
})
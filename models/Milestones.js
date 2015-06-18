var mongoose = require('mongoose');

var milestoneSchema = new mongoose.Schema({
	daysRequired: Number,
	milestoneText: String,
	quittingMethod: String
});

mongoose.model('Milestone', milestoneSchema);
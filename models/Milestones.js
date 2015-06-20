var mongoose = require('mongoose');

var milestoneSchema = new mongoose.Schema({
	daysRequired: Number,
	milestoneText: String,
	quittingMethod: String,
	isSmokingRequired: {type: Boolean, default: false}
});

mongoose.model('Milestone', milestoneSchema);
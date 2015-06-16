var mongoose = require('mongoose');

var feedbackSchema = new mongoose.Schema({
	summary: String,
	name: {type: String, null: true},
	content: String
});

mongoose.model('Feedback', feedbackSchema);
var mongoose = require('mongoose');

var storySchema = new mongoose.Schema({
	title: String,
	summary: String,
	imageUri: String,
	storyUri: String,
	isTopStory: Boolean
});

mongoose.model('Story', storySchema);
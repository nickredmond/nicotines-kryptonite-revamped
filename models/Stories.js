var mongoose = require('mongoose');
var random = require('mongoose-random');

var storySchema = new mongoose.Schema({
	title: String,
	summary: String,
	imageUri: String,
	storyUri: String,
	isTopStory: Boolean
	isTestStory: {null: true, default: false}
});

storySchema.plugin(random, { path: 'r' });
mongoose.model('Story', storySchema);
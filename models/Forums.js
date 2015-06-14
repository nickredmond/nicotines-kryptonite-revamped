var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var forumSchema = new mongoose.Schema({
	title: String,
	topics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
	creator: String
});

options = {
	whitelist: ['topics.comments']
};

forumSchema.plugin(deepPopulate, options);
mongoose.model('Forum', forumSchema);
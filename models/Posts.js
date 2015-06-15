var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var postSchema = new mongoose.Schema({
	title: String,
	content: String,
	creator: String,
	date_created: Date,
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
});

var options = {
	whitelist: ['comments.comments']
};
postSchema.plugin(deepPopulate, options);

mongoose.model('Post', postSchema);
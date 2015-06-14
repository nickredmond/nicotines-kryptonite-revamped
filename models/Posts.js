var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: String,
	content: String,
	creator: String,
	date_created: Date,
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
});

mongoose.model('Post', postSchema);
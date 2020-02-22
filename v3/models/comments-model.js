var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	content: String,
	title: String
});

var Comments = mongoose.model('comments', commentSchema);

module.exports = Comments;

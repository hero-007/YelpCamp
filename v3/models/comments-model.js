var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	content: String,
	author: String
});

var Comments = mongoose.model('comments', commentSchema);

module.exports = Comments;

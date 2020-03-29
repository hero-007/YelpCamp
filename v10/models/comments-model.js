var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	content: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

var Comments = mongoose.model('comments', commentSchema);

module.exports = Comments;

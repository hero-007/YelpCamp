var mongoose = require('mongoose');
var Comments = require('./comments-model');
// schema setup
var campgroundSchema = mongoose.Schema({
	name: String,
	img: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Comments
		}
	]
});

// create model of campground collection from the above schema
var Campground = mongoose.model('campgrounds', campgroundSchema);

module.exports = Campground;

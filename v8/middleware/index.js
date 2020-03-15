var Campground = require('../models/campgrounds-model');
var Comments = require('../models/comments-model');

var middleware = {};

// function to check if user is authorized to perform update and delete operation
middleware.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		// user is logged in
		var campId = req.params.id;
		Campground.findById(campId, function(err, foundCamp) {
			if (err) {
				res.redirect('back');
			} else {
				if (foundCamp.author.id.equals(req.user.id)) {
					return next();
				}
				return res.redirect('back');
			}
		});
	}
};

// middleware to check if user is authorized to edit or delete comment
middleware.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		// user is logged in
		var commentId = req.params.comment_id;
		Comments.findById(commentId, function(err, foundComment) {
			if (err) {
				console.log(err);
				res.redirect('campgrounds/' + req.params.id);
			} else {
				if (foundComment.author.id.equals(req.user.id)) {
					return next();
				}
				return res.redirect('back');
			}
		});
	}
};

middleware.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

module.exports = middleware;

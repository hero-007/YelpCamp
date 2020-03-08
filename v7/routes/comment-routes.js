var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campgrounds-model');
var Comments = require('../models/comments-model');

// ############################# Comments Route #####################################
router.get('/new', isLoggedIn, function(req, res) {
	// render a form for adding a new comment
	// allow to add comments only if user is logged in
	var campID = req.params.id;
	res.render('./comments/createComment', {
		campID: campID
	});
});

router.post('/', isLoggedIn, function(req, res) {
	// create a new comment in the database and add it to DB
	var postID = req.params.id;
	var newComment = {
		content: req.body.commentContent,
		author: {
			username: req.user.username,
			id: req.user._id
		}
	};

	Campground.findById(postID, function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			// create new comment and add it to foundCampground
			Comments.create(newComment, function(err, createdComment) {
				if (err) {
					console.log(err);
				} else {
					foundCampground.comments.push(createdComment);
					foundCampground.save();
					res.redirect(`/campgrounds/${postID}`);
				}
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;

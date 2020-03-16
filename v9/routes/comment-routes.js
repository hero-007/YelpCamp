var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campgrounds-model');
var Comments = require('../models/comments-model');
var middleware = require('../middleware');

// ############################# Comments Route #####################################
router.get('/new', middleware.isLoggedIn, function(req, res) {
	// render a form for adding a new comment
	// allow to add comments only if user is logged in
	var campID = req.params.id;
	res.render('./comments/createComment', {
		campID: campID
	});
});

router.post('/', middleware.isLoggedIn, function(req, res) {
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
					req.flash("success","comment added sucessfully");
					res.redirect(`/campgrounds/${postID}`);
				}
			});
		}
	});
});

// EDIT ROUTE - GET
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	var commentId = req.params.comment_id;
	var campId = req.params.id;

	Comments.findById(commentId, function(err, foundComment) {
		if (err) {
			return res.redirect('back');
		}
		res.render('./comments/editComment', {
			commentContent: foundComment.content,
			commentId: foundComment._id,
			campId: campId
		});
	});
});

// UPDATE ROUTE - PUT
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	var commentId = req.params.comment_id;
	var campId = req.params.id;
	var obj = {
		content: req.body.commentContent
	};

	Comments.findByIdAndUpdate(commentId, obj, function(err, updatedComment) {
		if (err) {
			console.log(err);
			req.flash("error","Unable to find the comment");
			return res.redirect('back');
		}
		req.flash("success","Comment Updated!!!");
		res.redirect('/campgrounds/' + campId);
	});
});

// DESTROY ROUTE - DELETE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	var commentId = req.params.comment_id;
	Comments.findByIdAndRemove(commentId, function(err) {
		if (err) {
			console.log(err);
			req.flash("error","unable to find the comment!!!");
			return res.redirect('back');
		}
		req.flash("success","Comment deleted sucessfully!!!");
		res.redirect('/campgrounds/' + req.params.id);
	});
});

module.exports = router;

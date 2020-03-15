var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds-model');
var Comment = require('../models/comments-model');
var middleware = require('../middleware');

// campgrounds route will give the list of all the campgrounds in our database
router.get('/', function(req, res) {
	// fetch all the campgrounds from the db and create a object named with campgrounds using the objects inside the retrieved objects
	Campground.find({}, function(err, camps) {
		if (err) {
			var campgrounds = {};
			res.render('./campground/campgrounds', {
				campgrounds: campgrounds
			});
		} else {
			res.render('./campground/campgrounds', {
				campgrounds: camps
			});
		}
	});
});

// post route for adding campground
router.post('/', middleware.isLoggedIn, function(req, res) {
	// fetch data sent by the user
	// add the data to campgrounds array
	// redirect to the /campgrounds get route
	var name = req.body['name'];
	var imgURL = req.body['imgURL'];
	var desc = req.body['description'];
	var campAuthor = {
		id: req.user._id,
		username: req.user.username
	};

	var obj = {
		name: name,
		img: imgURL,
		description: desc,
		author: campAuthor
	};

	Campground.create(obj, function(err, camp) {
		if (err) {
			console.log('Failed to save object in the database');
			console.log(err);
		} else {
			// console.log(camp + ' \n saved in the database');
		}
		res.redirect('/campgrounds');
	});
});

// get route for rendering form that allows you to enter new campgrounds
router.get('/new', middleware.isLoggedIn, function(req, res) {
	// this route will render a form
	res.render('./campground/newCampgroundForm');
});

// display information about a particulat campground
router.get('/:id', function(req, res) {
	// SHOW route for campgrounds
	var objId = req.params.id;
	Campground.findById(objId).populate('comments').exec(function(err, camp) {
		if (err) {
			console.log('Error Occured in SHOW route: ' + err);
			res.redirect('./campground/campgrounds');
		} else {
			res.render('./campground/show', {
				camp: camp
			});
		}
	});
});

// DELETE ROUTE - delete a campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	var campId = req.params.id;

	Campground.findByIdAndRemove(campId, function(err, removedCampground) {
		if (err) {
			console.log(err);
			return res.redirect('/campgrounds/' + campId);
		}

		Comment.deleteMany({ _id: { $in: removedCampground.comments } }, function(err) {
			if (err) {
				console.log(err);
				return res.redirect('/campgrounds');
			}
			res.redirect('/campgrounds');
		});
	});
});

// EDIT ROUTE - load a form for editing campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	var campId = req.params.id;
	Campground.findById(campId, function(err, foundCamp) {
		if (err) {
			console.log(err);
			return res.redirect('/campgrounds/' + campId);
		}
		// also pass the info of foundCamp
		console.log(foundCamp);

		res.render('./campground/editCampground', {
			campInfo: foundCamp
		});
	});
});

// UPDATE ROUTE - Save the updated campground into the database
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	var campId = req.params.id;
	// find camp by its ID and then update it with new content
	Campground.findByIdAndUpdate(campId, req.body.updatedCamp, function(err, savedCamp) {
		if (err) {
			console.log(err);
			return res.redirect('/campgrounds/' + campId);
		}
		res.redirect('/campgrounds/' + campId);
	});
});

module.exports = router;

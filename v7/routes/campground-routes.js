var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds-model');

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
router.post('/', isLoggedIn, function(req, res) {
	// fetch data sent by the user
	// add the data to campgrounds array
	// redirect to the /campgrounds get route
	var name = req.body['name'];
	var imgURL = req.body['imgURL'];
	var desc = req.body['description'];
	var obj = {
		name: name,
		img: imgURL,
		description: desc
	};

	// save obj inside campgrounds collection
	Campground.create(obj, function(err, camp) {
		if (err) {
			console.log('Failed to save object in the database');
			console.log(err);
		} else {
			console.log(camp + ' \n saved in the database');
		}
		res.redirect('./campground/campgrounds');
	});
});

// get route for rendering form that allows you to enter new campgrounds
router.get('/new', isLoggedIn, function(req, res) {
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

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;

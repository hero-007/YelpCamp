var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var Campground = require('./models/campgrounds-model');
var Comments = require('./models/comments-model');
var seedDB = require('./seed');

// seed the database everytime server starts
seedDB();
// connnect to mongoDB database
mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Landing page of YelpCamp - index.ejs
app.get('/', function(req, res) {
	res.render('landing');
});

// campgrounds route will give the list of all the campgrounds in our database
app.get('/campgrounds', function(req, res) {
	// fetch all the campgrounds from the db and create a object named with campgrounds using the objects inside the retrieved objects
	Campground.find({}, function(err, camps) {
		if (err) {
			var campgrounds = {};
			res.render('campgrounds', {
				campgrounds: campgrounds
			});
		} else {
			res.render('campgrounds', {
				campgrounds: camps
			});
		}
	});
});

// post route for adding campground
app.post('/campgrounds', function(req, res) {
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
		res.redirect('/campgrounds');
	});
});

// get route for rendering form that allows you to enter new campgrounds
app.get('/campgrounds/new', function(req, res) {
	// this route will render a form
	res.render('newCampgroundForm');
});

// display information about a particulat campground
app.get('/campgrounds/:id', function(req, res) {
	// SHOW route for campgrounds
	var objId = req.params.id;
	Campground.findById(objId).populate('comments').exec(function(err, camp) {
		if (err) {
			console.log('Error Occured in SHOW route: ' + err);
			res.redirect('/campgrounds');
		} else {
			console.log(camp);
			res.render('show', {
				camp: camp
			});
		}
	});
});

// Server listening for request on port - 3000
app.listen(3000, function(req, res) {
	console.log('Server Started Successfully !!!');
	console.log('Listening on PORT : 3000');
});

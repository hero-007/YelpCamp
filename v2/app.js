var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Temporary array for holding campgrounds
var campgrounds = [
	{
		name: 'Salmon Creek',
		imgUrl: 'https://bit.ly/3882Lap'
	},
	{
		name: 'Dalai Hills',
		imgUrl: 'https://bit.ly/2SdPJT2'
	},
	{
		name: 'Lancy Down',
		imgUrl: 'https://bit.ly/2Sc0FAL'
	},
	{
		name: 'Salmon Creek',
		imgUrl: 'https://bit.ly/3882Lap'
	},
	{
		name: 'Dalai Hills',
		imgUrl: 'https://bit.ly/2SdPJT2'
	},
	{
		name: 'Lancy Down',
		imgUrl: 'https://bit.ly/2Sc0FAL'
	}
];

// Landing page of YelpCamp - index.ejs
app.get('/', function(req, res) {
	res.render('landing');
});

// campgrounds route will give the list of all the campgrounds in our database
app.get('/campgrounds', function(req, res) {
	console.log(campgrounds.length);
	res.render('campgrounds', {
		campgrounds: campgrounds
	});
});

// post route for adding campground
app.post('/campgrounds', function(req, res) {
	// fetch data sent by the user
	// add the data to campgrounds array
	// redirect to the /campgrounds get route
	var name = req.body['name'];
	var imgURL = req.body['imgURL'];
	var obj = {
		name: name,
		imgUrl: imgURL
	};

	campgrounds.push(obj);
	res.redirect('/campgrounds');
});

// get route for rendering form that allows you to enter new campgrounds
app.get('/campgrounds/new', function(req, res) {
	// this route will render a form
	res.render('newCampgroundForm');
});
// Server listening for request on port - 3000
app.listen(3000, function(req, res) {
	console.log('Server Started Successfully !!!');
	console.log('Listening on PORT : 3000');
});

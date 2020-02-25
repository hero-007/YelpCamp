var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var Campground = require('./models/campgrounds-model');
var Comments = require('./models/comments-model');
var passport = require("passport");
var User = require("./models/user-model");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var seedDB = require('./seed');

// seed the database everytime server starts

// seedDB();

// connnect to mongoDB database
mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	require('express-session')({
		secret:"Hero is the best",
		resave: false,
		saveUninitialized: false
	})
);

// initializing passport 
app.use(passport.initialize());
app.use(passport.session());
// serialize and deserialize data from the session using the method provided by passport 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
		res.redirect('./campground/campgrounds');
	});
});

// get route for rendering form that allows you to enter new campgrounds
app.get('/campgrounds/new', function(req, res) {
	// this route will render a form
	res.render('./campground/newCampgroundForm');
});

// display information about a particulat campground
app.get('/campgrounds/:id', function(req, res) {
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

// ############################# Comments Route #####################################
app.get('/campgrounds/:id/comments/new', function(req, res) {
	// render a form for adding a new comment
	var campID = req.params.id;
	res.render('./comments/createComment', {
		campID: campID
	});
});

app.post('/campgrounds/:id/comments', function(req, res) {
	// create a new comment in the database and add it to DB
	var postID = req.params.id;
	var newComment = {
		content: req.body.commentContent,
		author: req.body.commentAuthor
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

// ################ Authentication Routes ################## // 

// REGISTER ROUTES
app.get("/register",function(req,res){
	// render register form 
	res.render("./user/register");
});

app.post("/register",function(req,res){
	// insert new user to DB
	User.register(new User({
		username : req.body.username
	}), req.body.password, function(err, savedUser){
		if(err)
		{
			// redirect user to register page again 
			console.log(err);
			return res.redirect("/register");
		}
		// Otherwise add the user to DB
		passport.authenticate("local")(req,res,function(){
			// this will login the user 
			res.redirect("/campgrounds");
		});
	})
});

// LOGIN ROUTES
app.get("/login",function(req,res){
	// render login form 
	res.render("./user/login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req,res){
	// login user 
});

// LOGOUT ROUTE 
app.get("/logout",function(req,res){
	// logout user from the current session
	req.logout();
	res.redirect("/campgrounds");
});
// isLoggedIn - middle-ware to check if user is logged in or not
function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	// res.redirect('/login');
}	
// Server listening for request on port - 3000
app.listen(3000, function(req, res) {
	console.log('Server Started Successfully !!!');
	console.log('Listening on PORT : 3000');
});

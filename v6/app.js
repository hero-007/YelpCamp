var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');
var User = require('./models/user-model');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
// var seedDB = require('./seed');

// seed the database everytime server starts

// seedDB();

// require all the routes
var campgroundRoutes = require('./routes/campground-routes');
var commentRoutes = require('./routes/comment-routes');
var indexRoutes = require('./routes/index');

// connnect to mongoDB database
mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	require('express-session')({
		secret: 'Hero is the best',
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

// put the loggedIn user info inside res.locals
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

// using the above required routes
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// Server listening for request on port - 3000
app.listen(3000, function(req, res) {
	console.log('Server Started Successfully !!!');
	console.log('Listening on PORT : 3000');
});

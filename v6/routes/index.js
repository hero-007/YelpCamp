var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user-model');

// Landing page of YelpCamp - index.ejs
router.get('/', function(req, res) {
	res.render('landing');
});

// ################ Authentication Routes ################## //

// REGISTER ROUTES
router.get('/register', function(req, res) {
	// render register form
	res.render('./user/register');
});

router.post('/register', function(req, res) {
	// insert new user to DB
	User.register(
		new User({
			username: req.body.username
		}),
		req.body.password,
		function(err, savedUser) {
			if (err) {
				// redirect user to register page again
				console.log(err);
				return res.redirect('/register');
			}
			// Otherwise add the user to DB
			passport.authenticate('local')(req, res, function() {
				// this will login the user
				res.redirect('/campgrounds');
			});
		}
	);
});

// LOGIN ROUTES
router.get('/login', function(req, res) {
	// render login form
	res.render('./user/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	function(req, res) {
		// login user
	}
);

// LOGOUT ROUTE
router.get('/logout', function(req, res) {
	// logout user from the current session
	req.logout();
	res.redirect('/campgrounds');
});
// isLoggedIn - middle-ware to check if user is logged in or not
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;

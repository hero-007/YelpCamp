var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds-model');
var Comment = require('../models/comments-model');
var middleware = require('../middleware');

// Configuring Multer and Cloudinary for image upload feature 
var multer = require('multer');

// configuring the filename to be uploaded
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

// setting an image filter - it'll only allow jpg, jpeg, png and gif file to be uploaded
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'hero007', 
  api_key: 837858634144223, 
  api_secret: "CMfQKKwkWL6BWig7DlerTEdkV9E"
});

// campgrounds route will give the list of all the campgrounds in our database
router.get('/', function(req, res) {
	// fetch all the campgrounds from the db and create a object named with campgrounds using the objects inside the retrieved objects
	var noMatch;
	if (req.query.searchQuery) {
		const regex = new RegExp(escapeRegex(req.query.searchQuery), 'gi');
		console.log(regex);
		Campground.find({ name: regex }, function(err, camps) {
			if (err) {
				var campgrounds = {};
				res.render('./campground/campgrounds', {
					campgrounds: campgrounds,
					noMatch: noMatch
				});
			} else {
				if (camps.length < 1) {
					noMatch = 'No Campground match your query !!!';
				}

				res.render('./campground/campgrounds', {
					campgrounds: camps,
					noMatch: noMatch
				});
			}
		});
	} else {
		// Get all the campgrounds
		Campground.find({}, function(err, camps) {
			if (err) {
				var campgrounds = {};
				res.render('./campground/campgrounds', {
					campgrounds: campgrounds,
					noMatch: noMatch
				});
			} else {
				res.render('./campground/campgrounds', {
					campgrounds: camps,
					noMatch: noMatch
				});
			}
		});
	}
});

// post route for adding campground
router.post('/', middleware.isLoggedIn, upload.single('campgroundImage'), function(req, res) {
	// fetch data sent by the user
	// add the data to campgrounds array
	// redirect to the /campgrounds get route

	cloudinary.uploader.upload(req.file.path, function(result){
		// add cloudinary url for the image to the campground object under image property
		var uploadedImgUrl = result.secure_url;
		var name = req.body['name'];
		var desc = req.body['description'];
		var campAuthor = {
			id: req.user._id,
			username: req.user.username
		};

		var obj = {
			name: name,
			img: uploadedImgUrl,
			description: desc,
			author: campAuthor
		};

		Campground.create(obj, function(err, camp) {
			if (err) {
				console.log('Failed to save object in the database');
				console.log(err);
				req.flash('error', 'Failed to save Campground !!!');
				res.redirect('/campgrounds');
			} else {
				// console.log(camp + ' \n saved in the database');
				req.flash('success', 'Saved Campground Successfully!!!');
				res.redirect('/campgrounds');
			}
		});
	});
});

// get route for rendering form that allows you to enter new campgrounds
router.get('/new', middleware.isLoggedIn, function(req, res) {
	// this route will render a form
	res.render('./campground/newCampgroundForm');
});

// display information about a particulat campground
router.get('/:id', async function(req, res) {
	// SHOW route for campgrounds
	var objId = req.params.id;
	// Campground.findById(objId).populate('comments').exec(function(err, camp) {
	// 	if (err) {
	// 		console.log('Error Occured in SHOW route: ' + err);
	// 		res.redirect('./campground/campgrounds');
	// 	} else {
	// 		res.render('./campground/show', {
	// 			camp: camp
	// 		});
	// 	}
	// });

	// writing the above logic using async and await
	// try {
	// 	let foundCamp = await Campground.findById(objId).populate('comments').exec();
	// 	res.render('./campground/show', {
	// 		camp: foundCamp
	// 	});
	// } catch (err) {
	// 	console.log('Error Occured in SHOW route: ' + err);
	// 	res.redirect('./campground/campgrounds');
	// }

	Campground.findById(objId)
		.populate('comments')
		.exec()
		.then((foundCamp) => {
			res.render('./campground/show', {
				camp: foundCamp
			});
		})
		.catch((err) => {
			console.log('Error Occured in SHOW route: ' + err);
			res.redirect('./campground/campgrounds');
		});
});

// DELETE ROUTE - delete a campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	var campId = req.params.id;

	Campground.findByIdAndRemove(campId, function(err, removedCampground) {
		if (err) {
			console.log(err);
			req.flash('error', 'Unable to delete campground!!!');
			return res.redirect('/campgrounds/' + campId);
		}

		Comment.deleteMany({ _id: { $in: removedCampground.comments } }, function(err) {
			if (err) {
				console.log(err);
				return res.redirect('/campgrounds');
			}

			req.flash('success', 'Campground deleted sucessfully!!!');
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
			req.flash('error', 'Unable to find the Campground!!!');
			return res.redirect('/campgrounds/' + campId);
		}
		req.flash('success', 'Campground edited sucessfully');
		res.redirect('/campgrounds/' + campId);
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;

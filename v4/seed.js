var Campgrounds = require('./models/campgrounds-model');
var Comments = require('./models/comments-model');
// campData contains sample data for campgrounds
var campData = [
	{
		name: 'Dalai Hills',
		img:
			'https://images.unsplash.com/photo-1540329957110-b87b06f5718e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name: 'Artic Camps',
		img:
			'https://images.unsplash.com/photo-1561731857-c5ed4e052d0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like"
	},
	{
		name: 'George Everest',
		img:
			'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
	},
	{
		name: 'Kail Gardens',
		img:
			'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	}
];
// function for exporting
function seedDB() {
	// remove everything from the comments db
	Comments.deleteMany({}, function(err) {
		if (err) console.log(err);
		else console.log('All Comments removed successfully');
	});

	// remove everything related to campground from the DB
	Campgrounds.deleteMany({}, function(err) {
		if (err) console.log(err);
		else {
			console.log('Campgrounds removed successfully');
			// add sample camps to database
			campData.forEach(function(camp) {
				Campgrounds.create(camp, function(err, savedCamps) {
					if (err) {
						console.log(err);
					} else {
						// also remove the old comments
						// add sample comments to each of the camps
						Comments.create(
							{
								content: "This is the best camping ground I've ever been to.",
								author: 'Sherlok Holmes'
							},
							function(err, savedComment) {
								if (err) {
									console.log(err);
								} else {
									savedCamps.comments.push(savedComment);
									savedCamps.save();
									console.log('Comment added successfully...');
								}
							}
						);
					}
				});
			});
		}
	});
}

module.exports = seedDB;

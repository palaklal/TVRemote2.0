var express = require('express');
var router = express.Router();

require('./../db');
var mongoose = require('mongoose');
var Episode = mongoose.model('episode');
var TvShow = mongoose.model('tvShow');
//var TvShows = mongoose.model('tvShows');
var List = mongoose.model('List');
var User = mongoose.model('User');

var passport = require('passport');
var flash = require('connect-flash');

var request = require('request');


/* GET home page. */
router.get('/home', function(req, res) {
	if (!req.user) {
		res.redirect('/');
	}
 	else {
 		res.render('home', { 'user': req.user, 'message': req.flash('message') });
 	}
});

/* GET login page. */
router.get('/', function(req, res) {
	// Display the Login page with any flash message, if any
	res.render('index', { 'message': req.flash('message') });
});

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
	successRedirect: '/home',
	failureRedirect: '/',
	failureFlash : true
}));

/* GET Registration Page */
router.get('/signup', function(req, res){
	res.render('signup', {'message': req.flash('message')});
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
	successRedirect: '/home',
	failureRedirect: '/signup',
	failureFlash : true
}));

router.get('/signout', function(req, res) { //never ended up using because why would you ever sign out!
  req.logout();
  res.redirect('/');
});

router.post('/list/create', function(req, res) {
	if (req.body.name === '' || req.body.name === undefined) {
		req.flash('message', 'The list must have a name!');
		res.redirect('/home');
	}
	else {
		var newList = new List({
			name: req.body.name.toLowerCase()
		});
		User.findOneAndUpdate({username: req.body.username}, {$push: {lists: newList}}, function(err, user) {
			console.log(err,user);
			newList.save(function(err, list){
				if (err) { console.log(err); }
				else {
					req.params.slug = list.slug;
					res.redirect('/list/'+newList.slug);
				}
			});
		});
	}
});

router.get('/list/:slug', function(req, res, next) {
	List.findOne({slug: req.params.slug }, function(err, aList) {
		if (err) { console.log(err); }
		else {
			if (aList) {
				res.render('list', {'listName': aList.name, 'list-slug': req.params.slug, 'show': aList.shows, 'message': req.flash('message')});
			}
			else { res.render('error', { 'message': 'This list does not exist!'}); }
		}
	});
});

router.post('/show/create', function(req, res) {
	if (req.body.name === '' || req.body.name === undefined) {
		req.flash('message', 'The show must have a name!');
		res.redirect('/list/'+req.body.slug);
	}
	else {
		var url = "http://www.omdbapi.com/";
	    url += "?t=" + req.body.name + "&plot=full" +"&r=json" +"&apikey=c7c6dcb1";
		request(url, function(error, response, body) {
			var newTVShow = new TvShow({
				name: req.body.name
			});
			if (req.body.airs !== undefined) {
				newTVShow.day = req.body.airs;
			}
			if (req.body.returns !== undefined) {
				newTVShow.returnDate = req.body.returns;
			}

			var OMDB = JSON.parse(body);
			if (OMDB.Response === "False") {
				req.flash('message', 'The show could not be found on OMDB!');
				console.log("error: "+body);
				res.redirect('/list/'+req.body.slug);
			}
			else {
				console.log(OMDB.Poster);
				newTVShow.name = OMDB.Poster;
				TvShow.update(newTVShow);
				console.log(newTVShow);
				List.findOneAndUpdate({slug: req.body.slug}, {$push: {shows: newTVShow}}, function(err) {
					if (err) { console.log(err); }
					else {
						res.redirect('/list/'+req.body.slug);
					}
				});
			}
		});
	}
});

router.get('/api/shows', function(req, res, next) {
	TvShow.findOne({}, function(err, show) {
		res.send(show);
	});
});

//get information about project page
router.get('/project/information', function(req,res) {
	res.render('info');
});

// router.get('/index', function(req, res, next) {
//   res.render('index');
// });
module.exports = router;

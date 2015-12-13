var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

require('./../db');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var LocalStrategy   = require('passport-local').Strategy;


passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    User.findOne({ 'username' :  username }, // check in mongo if a user with username exists or not
      function(err, user) { // In case of any error, return using the done method
        if (err)
          return done(err);
        if (!user){         // Username does not exist, log error & redirect back
          console.log('User Not Found with username '+username);
          return done(null, false, req.flash('message', 'User Not found.'));                 
        }
        if (!isValidPassword(user, password)){ // User exists but wrong password, log the error 
          console.log('Invalid Password');
          return done(null, false, req.flash('message', 'Invalid Password'));
        }
        return done(null, user); // User and password both match, return user from done method
      }
    );
	}));

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };

	passport.use('signup', new LocalStrategy({
	    passReqToCallback : true
	  },
	  function(req, username, password, done) {
	    findOrCreateUser = function() {
	      User.findOne({'username':username},function(err, user) {  // find a user in Mongo with provided username
	        if (err){ // In case of any error return
	          console.log('Error in SignUp: '+err);
	          return done(err);
	        }
	        if (user) { // already exists
	          console.log('User already exists');
	          return done(null, false, req.flash('message','User Already Exists'));
	        } else { // if there is no user with that email, create the user
	          var newUser = new User();
	          // set the user's local credentials
	          newUser.username = username;
	          newUser.password = createHash(password);
	          newUser.email = req.param('email');
	          newUser.firstName = req.param('firstName');
	          newUser.lastName = req.param('lastName');
	 
	          // save the user
	          newUser.save(function(err) {
	            if (err){
	              console.log('Error in Saving user: '+err);  
	              throw err;  
	            }
	            console.log('User Registration succesful');    
	            return done(null, newUser);
	          });
	        }
	      });
	    };
	     
	    // Delay the execution of findOrCreateUser and execute 
	    // the method in the next tick of the event loop
	    process.nextTick(findOrCreateUser);
	  })
	);

	// Generates hash using bCrypt
	var createHash = function(password){
	 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
module.exports = router;

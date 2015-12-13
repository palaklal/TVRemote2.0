var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');

//schema
var episode = new mongoose.Schema({
  tvShow: {type: mongoose.Schema.Types.ObjectId, ref:'tvShow'}, //tv show it belongs to
  name: {type: String, required: true}, //name of episode
  aired: {type: Date, required: true }, //date it aired
  watched: {type: Boolean, required: false} //whether or not the user has said he's seen it
});


var tvShow = new mongoose.Schema({
  name: {type: String, required: true}, //name of tv show
  episodes: [episode], //list of episodes
  day: {type: String, required: false}, //day of the week it airs
  returnDate: {type: Date, required: false}, //when show returns from hiatus
  posterURL: {type: String, required: false}
});
tvShow.plugin(URLSlugs('name'));
// , {
//  _id: true
// });

var List = new mongoose.Schema({
  name: {type: String, required: true},
  shows: [tvShow]
});
List.plugin(URLSlugs('name'));

var User = new mongoose.Schema({
  // username, password provided by plugin
  username: String,
  password: String,
  email: String,
  lists:  [List]
});


mongoose.model('User', User);
mongoose.model('List', List);
//mongoose.model('tvShows', tvShows);
mongoose.model('tvShow', tvShow);
mongoose.model('episode', episode);

var uri = "mongodb://master:slave@ds061954.mongolab.com:61954/tv";
mongoose.connect(uri);
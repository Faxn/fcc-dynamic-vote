'use strict';

var express = require('express')
var app = express()


//Set up databases
var nedb = require('nedb')
var db_loc = process.env.DB_LOC || 'data';
var db_polls = new nedb({filename: db_loc+'/polls.json', autoload:true})
var db_users = new nedb({filename: db_loc+'/users.json', autoload:true})

//set up sessions
const session = require('express-session')
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true//,
  //cookie: { secure: true }
}))

//set up passport
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const TwitterStrategy = require('passport-twitter').Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.URL+":"+process.env.PORT+"/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
      var user = {id:profile.id, name:profile.displayName}
      done(null, user)
  }
));



var qs = require('querystring');
passport.serializeUser(function(user, cb) {
    cb(null, qs.stringify(user));
});
passport.deserializeUser(function(obj, cb) {
    cb(null, qs.parse(obj));
});

//passport-twitter routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

//Mount Sub-apps
var multiPage = require('./src/multiPage/app.js')(db_polls, db_users)
app.use("/multiPage", multiPage);

var api = require('./src/api.js')(db_polls, db_users)
app.use("/api", api)


app.get('/', function(req,res){
    res.redirect('/multiPage');
})

var port;
port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('App listening on port: '+port)
})


module.exports = app; //Required for testing

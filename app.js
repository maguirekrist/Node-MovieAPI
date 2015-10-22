var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

//Mongoose
var mongoose = require('mongoose');

// Passport JS
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Routes
var movies = require('./routes/movies');

//App
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('express-session')({
  secret: 'movies are awsome',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));


// Init routes
app.use('/api', movies);

//models
var Account = require('./models/account');
var movie = require('./models/movie');

//Passport config
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Connect
mongoose.connect('mongodb://localhost/movie-api');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;

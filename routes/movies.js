var Movie = require('../models/movie');
var Account = require('../models/account');
var passport = require('passport');
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var express = require('express');
var router = express.Router();

// Multer setup
var upload = multer({ dest: './public/uploads/'});


/* GET home page. */
router.get('/movies', function(req, res) {
  res.render('index', { title: "Movie API", user: req.user });
});

// Authentication
router.get('/movies/register', function(req, res) {
  res.render('register', { user: req.user, error: null });
});

router.post('/movies/register', function(req, res) {
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account){
    if(err) {
      return res.render('register', { error: "Sorry but that username is already taken!", user: req.user });
    }

    passport.authenticate('local')(req, res, function(){
      res.redirect('/api/movies');
    });
  });
});

router.get('/movies/login', function(req, res){
  res.render('login', { user: req.user });
});

router.post('/movies/login', passport.authenticate('local'), function(req, res){
  res.redirect('/api/movies');
});

router.get('/movies/logout', function(req, res) {
  req.logout();
  res.redirect('/api/movies');
});

router.get('/movies/add', function(req, res){
  res.render('add', { user: req.user });
});

router.get('/movies/all', function(req, res){
  Movie.find(function(err, movies) {
    if(err) throw err;
    res.render('movies', { movies: movies, user: req.user });
  });
});


router.get('/movies/delete/:id', function(req, res) {
  var id = req.params.id;
  Movie.remove({ _id: id }, function(err, movie){
    if(err) throw err;
    console.log('User deleted ' + movie.title );
    res.redirect('/api/movies/all');
  });
});

router.post('/movies/add', upload.single('userFile'),function(req, res){
    var title = req.body.title;
    var date = req.body.date;
    var director = req.body.director;
    var genre = req.body.genre;
    var tempPath = req.file.path.toString();
    var extName = path.extname(req.file.originalname.toString());
    var newPath = './public/uploads/'+title.toLowerCase()+'_'+director.toLowerCase()+extName;
    var filePath = '/uploads/'+title.toLowerCase()+'_'+director.toLowerCase()+extName;

    var newMovie = new Movie({

        title: title,

        releaseYear: date,

        director: director,

        genre: genre,

        movie_link: filePath

    });

    fs.rename(tempPath, newPath, function(err) {
        if(err) {
            console.log(err);
        }
    });

    newMovie.save(function(err){
      if (err) { throw err; }
      console.log('New Movie ' + title + ' added');
      res.redirect('/api/movies/all');
    });
});

router.get('/movies/:id', function(req, res){
    Movie.findOne({ _id: req.params.id }, function(err, movie){
        if (err) {
            return res.send(err);
        }
        res.render('movie', { movie: movie, user: req.user });
    });
});

// Locate and Update movies
router.put('/movies/:id', function(req, res) {
    Movie.find({ _id: req.params.id }, function(err, movie){
        if(err){
            return res.send(err);
        }

        for(prop in req.body){
            movie[prop] = req.body[prop];
        }

        //Save movie
        movie.save(function(err){
            if(err){
                return res.send(err);
            }

            res.json({ message: "Movie Updated" });
        });
    });
});

router.delete('/movies/:id', function(req, res){
    Movie.remove({
        _id: req.params.id
    }, function(err, movie){
        if(err) {
            return res.send(err);
        }

        res.json({ message: "Successfully deleted" });
    });
});




module.exports = router;

var Movie = require('../models/movie');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/movies', function(req, res) {
  res.render('index', { title: "Movie API" });
});

router.get('/movies/add', function(req, res){
  res.render('add');
});

router.get('/movies/all', function(req, res){
  Movie.find(function(err, movies) {
    if(err) throw err;
    res.render('movies', { movies: movies });
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

router.post('/movies/add', function(req, res){
  var title = req.body.title;
  var date = req.body.date;
  var director = req.body.director;
  var genre = req.body.genre;
  var newMovie = new Movie({
    title: title,
    releaseYear: date,
    director: director,
    genre: genre
  });

  newMovie.save(function(err){
    if (err) throw err;
    console.log('New Movie ' + title + ' added');
    res.redirect('/api/movies/all');
  });
});

router.get('/movies/:id', function(req, res){
    Movie.find({ _id: req.params.id }, function(err, movie){
        if (err){
            return res.send(err);
        }

        res.json(movie);
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

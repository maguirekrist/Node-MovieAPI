/**
 * Created by Maguire on 9/26/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    title: String,
    releaseYear: String,
    director: String,
    genre: String
});


module.exports = mongoose.model('Movie', movieSchema); // allows us to access this model outside of this file!

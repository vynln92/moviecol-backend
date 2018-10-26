'use strict';

module.exports = function(Movie) {

	Movie.remoteMethod('getMovies', {
		accepts: [		
		],
		returns: {arg: 'result', type: 'object'},
		http: {path:'/getMovies', verb: 'get'}
	});

	Movie.getMovies = function(cb) {
		Movie.find({}, function(err, result) {
			if (err) return cb(err);

			cb(null, result);			
		});		
	};

	Movie.remoteMethod('getMovieDetails', {
		accepts: [
			{arg: 'movieId', type: 'string', required: true}
		],
		returns: {arg: 'result', type: 'object'},
		http: {path:'/getMovieDetails', verb: 'get'}
	});	

	Movie.getMovieDetails = function(movieId, cb) {
		Movie.findOne({
			where: {			
				'_id' : movieId
			}	  
		}, function(err, result) {
			if (err) return cb(err);

			var doneGenreProcess = false
			var doneCastProcess = false

			getGenres(result.genres, function(genres) {						
				result.genres = genres
				doneGenreProcess = true

				if (doneCastProcess) {
					cb(null, result);				
				}
				
			})	
			getCasts(result.casts, function(casts) {						
				result.casts = casts
				doneCastProcess = true
				
				if (doneGenreProcess) {
					cb(null, result);				
				}							
			})				
		});		
	};
};

async function getGenres(genreIds, cb) {	
	var app = require('../../server/server');
	
	var Genre = app.models.Genre
	var count = 0
	var output = []
	var size = genreIds.length
	
	genreIds.forEach(function(element) {
		Genre.findOne({
			where: {			
				'_id' : element
			}               		
		}, function(err, result) {								
			count = count + 1			
			if (result) {				
				output.push(result)		
			}			
			if (count === size) {				
				cb(output)
			}
		});								  	
	});			
}

async function getCasts(castIds, cb) {	
	var app = require('../../server/server');
	
	var Artist = app.models.Artist
	var count = 0
	var output = []
	var size = castIds.length
	
	castIds.forEach(function(element) {
		Artist.findOne({
			fields: {
				id: true, name: true, topImage: true
			},
			where: {			
				'_id' : element
			}               		
		}, function(err, result) {								
			count = count + 1			
			if (result) {				
				output.push(result)		
			}			
			if (count === size) {				
				cb(output)
			}
		});								  	
	});			
}
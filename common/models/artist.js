'use strict';

module.exports = function(Artist) {
	
	Artist.remoteMethod('getArtistDetails', {
		accepts: [	
			{arg: 'artistId', type: 'string', required: true}	
		],
		returns: {arg: 'result', type: 'object'},
		http: {path:'/getArtistDetails', verb: 'get'}
	});

	Artist.getArtistDetails = function(artistId, cb) {
		Artist.findOne({
			where: {			
				'_id' : artistId
			}	  
		}, function(err, result) {
			if (err) return cb(err);			

			getMovies(artistId, function(err, movies){
				result.movies = movies

				return cb(null, result)
			})			
		});	
		
	};

};


async function getMovies(artistId, cb) {	
	var app = require('../../server/server');
	
	var Movie = app.models.Movie
	var count = 0
	var output = []

	Movie.find({
		fields: {
			id: true, name: true, topImage: true, casts: true
		},
	}, function(err, result) {
		if (err) cb(err);

		var choiceMovies = [];
		result.forEach(function(element) {			
			element.casts.forEach(function(cast) {				
				if (cast === artistId) {
					choiceMovies.push(element)
				}			  	
			});								  	
		});			
		cb(null, choiceMovies);			
	});			
}
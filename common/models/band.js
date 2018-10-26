'use strict';

module.exports = function(Band) {
	
	Band.remoteMethod('getBands', {
		accepts: [		
		],
		returns: {arg: 'result', type: 'object'},
		http: {path:'/getBands', verb: 'get'}
	});

	// listProjects
	Band.getBands = function(cb) {
		Band.find({}, function(err, result) {
			if (err) return cb(err);

			if (result != null) {	
				console.log(result)
				var output = []
				var count = 0;
				var size = result.length
				result.forEach(function(element) {			
					getArtistForBand(element.id, function(artists) {						
						count = count + 1						
						if (typeof artists !== 'undefined') {							
							element.artists = artists
						} 				
						output.push(element)		
						if (count === size) {
							cb(null, output)
						}	
					})						  	
				});							
			} else {
				// Not exist. 				
				cb("error", null)						
			}			
		});
		
	};
};

async function getArtistForBand(bandId, cb) {	
	var app = require('../../server/server');
	var Artist = app.models.Artist;
	console.log(bandId)
	Artist.find({
		filter: {
			where: {			
				'bandId' : bandId
			}					
		}                		
	}, function(err, result) {				
		if (err) return cb(null)
		
		var output = []
		var count = 0;
		var size = result.length
		result.forEach(function(element) {			
			getSongForArtist(element.id, function(songs) {
				console.log(element)
				count = count + 1
				console.log(songs)
				if (typeof songs !== 'undefined') {					
					element.songs = songs
				}				
				output.push(element)		
				if (count === size) {					
					return cb(null, output)
				}	
			})						  	
		});				
	});
}

async function getSongForArtist(artistId, cb) {	
	var app = require('../../server/server');
	var Song = app.models.Song;
	console.log(artistId)
	Song.find({
		filter: {
			where: {			
				'artistId' : artistId
			}					
		}                		
	}, function(err, result) {				
		if (err) return cb(null)
		
		console.log("Song response: " + result)

		return cb(result)
	});
}
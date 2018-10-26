'use strict';

module.exports = function(Genre) {

	Genre.remoteMethod('getGenres', {
		accepts: [		
		],
		returns: {arg: 'result', type: 'object'},
		http: {path:'/getGenres', verb: 'get'}
	});

	Genre.getGenres = function(cb) {
		Genre.find({}, function(err, result) {
			if (err) return cb(err);

			cb(null, result);			
		});		
	};
	
};
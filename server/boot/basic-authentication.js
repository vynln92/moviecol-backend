'use strict';

module.exports = function(app){
    app.use(function(req, res, next){
    	console.log(req.headers)
      if(req.headers['authorization'] === '123456'){
         return next();
      }

	// Remove later
      return next();

      res.json({error: "Forbidden error."});
   });
}

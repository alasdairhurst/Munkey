//Initialises the web app
export const initApi = function(app) {
	return new Promise(function (resolve, reject) {
		"use strict";

		app.get('/api', function (req, res) {
			res.send('munKey API');
		});

		app.use(function(req,res, next) {
			next();
		});

		resolve(app);
	});
};

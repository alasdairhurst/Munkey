'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
//Initialises the web app
var initApi = exports.initApi = function initApi(app) {
	return new Promise(function (resolve, reject) {
		"use strict";

		app.get('/api', function (req, res) {
			res.send('munKey API');
		});

		app.use(function (req, res, next) {
			console.log(req);
			next();
		});

		resolve(app);
	});
};
import routes from './routes/index';
import 'colors';

//Initialises the api app
export const initApi = function(app) {
	return new Promise((resolve, reject) => {
		"use strict";

		app.use((req ,res, next) => {
			console.log(`[${req.method} ${req.url}]`.green);
			next();
		});

		app.get(global.$config.api.path, (req, res) => {
			res.send('munKey API');
		});

		// setup all the routes
		for (let route of routes) {
			app[route.method](global.$config.api.path + route.path, route.action);
		}

		app.use((err, req, res, next) => {
			console.error(`[${req.method} ${req.url}]`.red, err.stack || err.message || err);
			res.status(err.code || 500).send(err.message || 'Server Error');
			next();
		});

		resolve(app);
	});
};

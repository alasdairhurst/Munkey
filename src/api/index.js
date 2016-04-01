import bodyParser from 'body-parser';
import morgan from 'morgan';
import multipartParser from 'middleware/parse.form';
import routes from './routes/index';
import 'colors';

//Initialises the api app
export const initApi = function(app) {
	return new Promise((resolve, reject) => {
		"use strict";

		app.use(morgan('dev'));
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(bodyParser.json());
		app.use(multipartParser);

		app.get(global.$config.api.path, (req, res) => {
			res.send('munKey API');
		});

		// setup all the routes
		for (let route of routes) {
			app[route.method](global.$config.api.path + route.path, route.action);
		}

		resolve(app);
	});
};

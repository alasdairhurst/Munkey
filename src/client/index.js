import express from 'express';
const app = express();

//Initialises the web app
export const initClient = function(webApp) {
	return new Promise(function(resolve, reject) {
		"use strict";

		app.get('/#/', function(req, res) {
			res.send('munKey credential manager');
		});

		// do some stuff with webApp if needed

		resolve(app);
	});
};
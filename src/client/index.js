import express from 'express';
const app = express();

//Initialises the web app
export function initClient() {
	return new Promise((resolve, reject) => {

		app.get('/', (req, res) => {
			console.log('redirect');
			//res.redirect('/#/');
		});

		app.get('/#/', function(req, res) {
			res.send('munKey credential manager');
		});

		// do some stuff with app if needed

		resolve(app);
	});
};
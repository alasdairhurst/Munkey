import express from 'express';
const app = express();
import session from 'express-session';
import KnexSessionStore from 'connect-session-knex';
import uuid from 'uuid';
import {db} from '../api/node_modules/db';
import path from 'path';
import _ from 'underscore';
import fs from 'fs';
const SessionStore = KnexSessionStore(session);
// setup session store
const store = new SessionStore({
	knex: db
});

//Initialises the web app
export function initClient() {
	return new Promise((resolve, reject) => {

		// session
		app.use(session({
			genid: () => {
				return uuid.v4();
			},
			secret: global.$config.session.secret,
			resave: false,
			saveUninitialized: true,
			store
		}));

		const html = _.template('' + fs.readFileSync(__dirname + '/index.html'))();

		app.get('/index.html', function(req, res) {
			res.redirect('/');
		});

		app.get('/', function(req, res) {
			res.send(html);
		});

		const staticHandler = express.static('public');

		app.use(staticHandler);
		app.use('/', staticHandler);

		//app.get('/#/', function(req, res) {
		//	res.send('munKey credential manager');
		//});

		// do some stuff with app if needed

		resolve(app);
	});
};
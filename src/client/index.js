import express from 'express';
const app = express();
import session from 'express-session';
import KnexSessionStore from 'connect-session-knex';
import uuid from 'uuid';
import {db} from '../api/node_modules/db';
import path from 'path';
import _ from 'underscore';
import fs from 'fs';
import helmet from 'helmet';
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

		// make sure it can only be used locally for now.
		app.use((req, res, next) => {
			//console.log(req.connection.remoteAddress);
			//if (req.connection.remoteAddress != '::1') {
			//	return res.send('<div>404 Not Found</div>');
			//}
			return next();
		});

		const html = _.template('' + fs.readFileSync(__dirname + '/index.html'))();

		app.get('/index.html', function(req, res) {
			res.redirect('/');
		});

		app.get('/', function(req, res) {
			res.send(html);
		});

		const staticHandler = express.static('public');

		//app.use(helmet());
		app.use(staticHandler);
		app.use('/', staticHandler);

		//app.get('/#/', function(req, res) {
		//	res.send('munKey credential manager');
		//});

		// do some stuff with app if needed

		resolve(app);
	});
};
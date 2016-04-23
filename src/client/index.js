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
import https from 'https';
import http from 'http';
const SessionStore = KnexSessionStore(session);
// setup session store
const store = new SessionStore({
	knex: db
});

//Initialises the web app
export function initClient() {
	return new Promise((resolve, reject) => {

		app.https = https.createServer({
			hostname: global.$config.host,
			cert: global.$config.https.cert,
			key: global.$config.https.key,
			ca: global.$config.https.ca,
			passphrase: global.$config.https.passphrase
		}, app);

		// session setup
		app.use(session({
			genid: () => {
				return uuid.v4();
			},
			cookie: {
				secure: true,
				httpOnly: false,
				domain: $config.host,
				expires: new Date(Date.now + $config.session.cookie.expires)
			},
			name : 'munkeySessionId', // generic cookie names avoid attackers fingerprinting the default one
			secret: global.$config.session.secret,
			resave: false,
			saveUninitialized: true,
			store
		}));

		// make sure it can only be used locally for development.
		if (process.env.NODE_ENV == 'development') {
			app.use((req, res, next) => {
				console.log(req.connection.remoteAddress);
				if (req.connection.remoteAddress != '::1') {
					return res.send('<div>404 Not Found</div>');
				}
				return next();
			});
		}

		app.get('/index.html', function(req, res) {
			res.redirect('/');
		});

		app.get('/', function(req, res) {
			const html = _.template(fs.readFileSync(path.join(__dirname, 'index.html')) + '')();
			res.send(html);
		});

		// remove the express header to reduce the number of targeted attacks
		app.disable('x-powered-by');

		// xss protection and some other useful stuff
		app.use(helmet());

		app.use(helmet.hsts({
			maxAge: 10886400000,     // Must be at least 18 weeks to be approved by Google
			includeSubdomains: true, // Must be enabled to be approved by Google
			preload: true
		}));

		// set up staitc resources at the root
		const staticHandler = express.static('public');
		app.use('/', staticHandler);
		app.use(staticHandler);


		resolve(app);
	});
};
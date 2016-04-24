import './conf';
import express from 'express';
const app = express();
import session from 'express-session';
import KnexSessionStore from 'connect-session-knex';
import uuid from 'uuid';
import {db} from 'db';
import path from 'path';
import _ from 'underscore';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import routes from './routes/index';
import 'colors';
import formidable from 'formidable'
const SessionStore = KnexSessionStore(session);
// setup session store
const store = new SessionStore({
	knex: db
});

const httpServer = https.createServer(global.$config.https.server, app);

// session setup
app.use(session({
	genid: () => {
		return uuid.v4();
	},
	cookie: {
		secure: true,
		httpOnly: false,
		domain: $config.https.server.hostname,
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

// logging
app.use(morgan('dev'));

// parse body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// parse multipart forms
app.use((req, res, next) => {
	if (req.headers['content-type'] && req.headers['content-type'].split('/')[0] === 'multipart') {
		return new formidable.IncomingForm().parse(req, (err, fields, files) => {
			if (err) { return next(err); }
			req.body = fields;
			req.files = files;
			next();
		});
	}
	next();
});

app.get(global.$config.api.path, (req, res) => {
	res.send('munKey API');
});

// setup all the routes
for (let route of routes) {
	console.log('Setting up route:'.blue, route.method.green, global.$config.api.path + route.path);
	app[route.method](global.$config.api.path + route.path, route.action);
}

httpServer.listen($config.https.port, () => {
	console.log("Started listening on https port", $config.https.port);
});

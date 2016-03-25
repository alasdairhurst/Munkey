import './conf';
import {initApi} from './api/index';
import {initClient} from './client/index';
import {db} from './api/node_modules/db';

// connect to the databases then initialise everything.
db.connect()
	.then(initClient)
	.then(initApi)
	.then(app => {
		app.listen($config.http.port, () => {
			console.log("Started listening on port", $config.http.port);
		});
	})
	.catch(err => {
		"use strict";
		console.error('Error Initialising MunKey');
		console.error(err.stack);
		process.exit(1);
	});

process.on('SIGINT',() => {
	console.log('\nShutting down MunKey');
	// add cleanup here
	db.disconnect()
	.then(() => {
		process.exit();
	})
	.catch(err => {
		console.error(err.stack);
		process.exit(1);
	});
});
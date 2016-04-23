import './conf';
import {initApi} from './api/index';
import {initClient} from './client/index';
import './api/node_modules/db';

initClient()
	.then(initApi)
	.then(server => {
		server.https.listen($config.https.port, () => {
			console.log("Started listening on https port", $config.https.port);
		});
	})
	.catch(err => {
		"use strict";
		console.error('Error Initialising MunKey');
		console.error(err.stack);
		process.exit(1);
	});

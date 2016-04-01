import './conf';
import {initApi} from './api/index';
import {initClient} from './client/index';
import './api/node_modules/db';

initClient()
	.then(initApi)
	.then(server => {
		server.listen($config.http.port, () => {
			console.log("Started listening on port", $config.http.port);
		});
	})
	.catch(err => {
		"use strict";
		console.error('Error Initialising MunKey');
		console.error(err.stack);
		process.exit(1);
	});

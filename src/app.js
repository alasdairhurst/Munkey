import './conf';
import {initApi} from './api/index';
import {initClient} from './client/index';

initClient()
	.then(initApi())
	.then(function(app) {
		app.listen($config.http.port, function() {
			console.log("Started listening on port", $config.http.port);
		});
	});
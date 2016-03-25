'use strict';

require('./conf');

var _index = require('./api/index');

var _index2 = require('./client/index');

var _db = require('./api/node_modules/db');

// connect to the databases then initialise everything.
_db.db.connect().then(_index2.initClient).then(_index.initApi).then(function (app) {
	app.listen($config.http.port, function () {
		console.log("Started listening on port", $config.http.port);
	});
}).catch(function (err) {
	"use strict";

	console.error('Error Initialising MunKey');
	console.error(err.stack);
	process.exit(1);
});

process.on('SIGINT', function () {
	console.log('\nShutting down MunKey');
	// add cleanup here
	_db.db.disconnect().then(function () {
		process.exit();
	}).catch(function (err) {
		console.error(err.stack);
		process.exit(1);
	});
});
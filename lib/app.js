'use strict';

require('./conf');

var _index = require('./api/index');

var _index2 = require('./client/index');

(0, _index2.initClient)().then((0, _index.initApi)()).then(function (app) {
	app.listen($config.http.port, function () {
		console.log("Started listening on port", $config.http.port);
	});
});
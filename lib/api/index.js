'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initApi = undefined;

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

require('colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Initialises the api app
var initApi = exports.initApi = function initApi(app) {
	return new Promise(function (resolve, reject) {
		"use strict";

		app.use(function (req, res, next) {
			console.log(('[' + req.method + ' ' + req.url + ']').green);
			next();
		});

		app.get(global.$config.api.path, function (req, res) {
			res.send('munKey API');
		});

		// setup all the routes
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _index2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var route = _step.value;

				app[route.method](global.$config.api.path + route.path, route.action);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		app.use(function (err, req, res, next) {
			console.error(('[' + req.method + ' ' + req.url + ']').red, err.stack || err.message || err);
			res.status(err.code || 500).send(err.message || 'Server Error');
			next();
		});

		resolve(app);
	});
};
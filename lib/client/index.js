'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initClient = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

//Initialises the web app
var initClient = exports.initClient = function initClient(webApp) {
	return new Promise(function (resolve, reject) {
		"use strict";

		app.get('/', function (req, res) {
			res.send('munKey credential manager');
		});

		// do some stuff with webApp if needed

		resolve(app);
	});
};
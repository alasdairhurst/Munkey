'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initClient = initClient;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

//Initialises the web app
function initClient() {
	return new Promise(function (resolve, reject) {

		app.get('/', function (req, res) {
			console.log('redirect');
			//res.redirect('/#/');
		});

		app.get('/#/', function (req, res) {
			res.send('munKey credential manager');
		});

		// do some stuff with app if needed

		resolve(app);
	});
};
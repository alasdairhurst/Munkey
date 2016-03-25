'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _db = require('db');

require('userdata');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Creates a new user for munKey if none exists.
 */
exports.default = {
	path: 'user',
	method: 'post',
	action: function action(req, res, next) {
		// we just want to allow one user for now
		console.log(req.body);
		_db.db.query('SELECT username FROM users').then(function (users) {
			if (users.length) {
				return next({ code: 403, message: 'User already exists' });
			}
			var username = global.$config.default.username;
			return res.send(_defineProperty({}, username, users));
		}).catch(function (err) {
			return next(err);
		});
	}
};
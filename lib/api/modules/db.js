'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Database = exports.db = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = global.$config.db;

/**
 * Database class used to connect and query tables
 */

var Database = function () {
	function Database(opts) {
		_classCallCheck(this, Database);

		// sets up a connection with a specific configuration
		this.connection = _mysql2.default.createConnection(opts);
	}

	/**
  * Connects to MySQL
  * @returns {Promise}
  */


	_createClass(Database, [{
		key: 'connect',
		value: function connect() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_this.connection.connect(function (err) {
					if (err) {
						return reject(err);
					}
					_this.log('Connected');
					resolve();
				});
			});
		}

		/**
   * Ends the connection to MySQL
   * @returns {Promise}
   */

	}, {
		key: 'disconnect',
		value: function disconnect() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2.connection.end(function (err) {
					if (err) {
						return reject(err);
					}
					_this2.log('Disconnected');
					resolve();
				});
			});
		}

		/**
   * Performs a query on the connected database
   * @param string the query to perform
   * @returns {Promise}
   */

	}, {
		key: 'query',
		value: function query(string) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				var time = Date.now();
				_this3.connection.query(string, function (err, result) {
					if (err) {
						return reject(err);
					}
					// log out the query as well as the time taken
					_this3.log('Query: ' + string + ', delta: ' + (Date.now() - time) + 'ms');
					resolve(result);
				});
			});
		}

		/**
   * Just some fancy logging to wrap the database name
   * @param string
   */

	}, {
		key: 'log',
		value: function log(string) {
			console.log('[MySQL ' + (this.connection.config.database || 'default') + '] ' + string);
		}
	}]);

	return Database;
}();

var db = new Database(config.main);

exports.db = db;
exports.Database = Database;
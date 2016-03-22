'use strict';

require('../conf');

var _db = require('../modules/db');

var db = _interopRequireWildcard(_db);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Start off with a connection that isn't specific to a certain database
var baseDB = new db.Database(global.$config.db.base);

baseDB.connect()
// We don't want it to crash if the databases already exist, so gracefuly continue
.then(function () {
  return baseDB.query('CREATE DATABASE IF NOT EXISTS ' + global.$config.db.main.database);
}).then(function () {
  return baseDB.query('CREATE DATABASE IF NOT EXISTS ' + global.$config.db.session.database);
}).then(function () {
  return baseDB.disconnect();
}).then(function () {
  return db.main.connect();
}).then(function () {
  return db.session.connect();
})
// Create the tables for the main database
.then(function () {
  return db.main.query('CREATE TABLE IF NOT EXISTS users (' + 'id INT,' + 'created DATETIME NOT NULL,' + 'updated DATETIME NULL,' + 'username VARCHAR(45) NULL,' + 'password VARCHAR(45) NULL,' + 'password_salt VARCHAR(45) NULL,' + 'data VARCHAR(1000) NULL,' + 'PRIMARY KEY (id))');
})
// Create the tables for the session database
.then(function () {
  return db.main.disconnect();
}).then(function () {
  return db.session.disconnect();
}).catch(logAndExit);

function logAndExit(err) {
  console.error(err.stack);
  process.exit(1);
}
import '../conf';
import * as db from '../modules/db';

// Start off with a connection that isn't specific to a certain database
const baseDB = new db.Database(global.$config.db.base);

baseDB.connect()
	// We don't want it to crash if the databases already exist, so gracefuly continue
.then(() => baseDB.query(`CREATE DATABASE IF NOT EXISTS ${global.$config.db.main.database}`))
.then(() => baseDB.query(`CREATE DATABASE IF NOT EXISTS ${global.$config.db.session.database}`))
.then(() => baseDB.disconnect())
.then(() => db.main.connect())
.then(() => db.session.connect())
	// Create the tables for the main database
.then(() => db.main.query('CREATE TABLE IF NOT EXISTS users (' +
  'id INT,' +
  'created DATETIME NOT NULL,'+
  'updated DATETIME NULL,'+
  'username VARCHAR(45) NULL,'+
  'password VARCHAR(45) NULL,'+
  'password_salt VARCHAR(45) NULL,'+
  'data VARCHAR(1000) NULL,'+
  'PRIMARY KEY (id))'))
	// Create the tables for the session database
.then(() => db.main.disconnect())
.then(() => db.session.disconnect())
.catch(logAndExit);


function logAndExit(err) {
	console.error(err.stack);
	process.exit(1);
}


import '../conf';
import {Database, db} from '../api/node_modules/db';

// Start off with a connection that isn't specific to a certain database
const baseDB = new Database(global.$config.db.base);

baseDB.connect()
	// We don't want it to crash if the databases already exist, so gracefuly continue
.then(() => baseDB.query(`CREATE DATABASE IF NOT EXISTS ${global.$config.db.main.database}`))
.then(() => baseDB.disconnect())
.then(() => db.connect())
	// Create the tables for the main database
.then(() => db.query('CREATE TABLE IF NOT EXISTS users (' +
  'id INT NOT NULL AUTO_INCREMENT,' +
  'created DATETIME NOT NULL,'+
  'updated DATETIME NOT NULL,'+
  'username TEXT NOT NULL,'+
  'password VARCHAR(45) NOT NULL,'+
  'password_salt VARCHAR(45) NOT NULL,'+
  'data BLOB NULL,'+
  'PRIMARY KEY (id))'))
	// Create the tables for the session database
.then(() => db.query('CREATE TABLE IF NOT EXISTS sessions (' +
    'id INT NOT NULL AUTO_INCREMENT,' +
    'created DATETIME NOT NULL,'+
    'updated DATETIME NOT NULL,'+
    'user_id INT NOT NULL,'+
    'PRIMARY KEY (id))'))
.then(() => db.disconnect())
.catch(err => {
  console.error(err.stack);
  process.exit(1);
});


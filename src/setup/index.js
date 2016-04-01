import '../conf';
import {db, baseDB} from '../api/node_modules/db';

baseDB.raw(`CREATE DATABASE IF NOT EXISTS ${global.$config.db.connection.database}`)
	.then(() => {
		return db.schema.createTableIfNotExists('users', table => {
			table.increments('id').primary();
			table.timestamps();
			table.text('username');
			table.text('password');
			table.text('password_salt');
			table.json('data');
		});
	})
	.then(() => {
		return db.schema.createTableIfNotExists('sessions', table => {
			table.increments('id').primary();
			table.timestamps();
			table.text('user_id');
		});
	})
	.then(() => {
		process.exit();
	})
	.catch(err => {
	  console.error(err.message, '\n', err.stack);
	  process.exit(1);
	});

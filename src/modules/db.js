import mysql from 'mysql';
const config = global.$config.db;

/**
 * Database class used to connect and query tables
 */
export class Database {
	constructor(opts) {
		// sets up a connection with a specific configuration
		this.connection = mysql.createConnection(opts);
	}

	/**
	 * Connects to MySQL
	 * @returns {Promise}
	 */
	connect() {
		return new Promise((resolve, reject) => {
			this.connection.connect(err => {
				if (err) { return reject(err); }
				this.log(`Connected`);
				resolve();
			});
		});
	}

	/**
	 * Ends the connection to MySQL
	 * @returns {Promise}
	 */
	disconnect() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err) { return reject(err); }
				this.log(`Disconnected`);
				resolve();
			});
		});
	}

	/**
	 * Performs a query on the connected database
	 * @param string the query to perform
	 * @returns {Promise}
	 */
	query(string){
		return new Promise((resolve, reject) => {
			const time = Date.now();
			this.connection.query(string, (err, result) => {
				if (err) { return reject(err); }
				// log out the query as well as the time taken
				this.log(`Query: ${string}, delta: ${Date.now() - time}ms`);
				resolve(result);
			});
		});
	}

	/**
	 * Just some fancy logging to wrap the database name
	 * @param string
	 */
	log(string) {
		console.log(`[MySQL ${this.connection.config.database || 'default'}] ${string}`);
	}
}

export const
		main = new Database(config.main),
		session = new Database(config.session);

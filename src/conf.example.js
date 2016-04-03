global.$config = {
	http: {
		port: 8000
	},
	default: {
		username: "changeme"
	},
	api: {
		path: '/api/v1/'
	},
	crypto: {
		salt: {
			bytes: 256
		},
		hash: {
			iterations: 10000
		}
	},
	session: {
		secret: "mySecret"
	},
	db: {
		connection: {
			host: 'localhost',
			port: 3306,
			user: "root",
			password: "root",
			database: "munkey"
		},
		debug: false
	}
};

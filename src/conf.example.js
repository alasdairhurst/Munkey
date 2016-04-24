import path from 'path';
import fs from 'fs';
const certPath = path.join(__dirname, path.join('..', 'certs'));
global.$config = {
	host: 'localhost',
	https: {
		port: 4443,
		server: {
			key: fs.readFileSync(path.join(certPath,'key.pem')).toString(),
			cert: fs.readFileSync(path.join(certPath,'cert.pem')).toString(),
			ca: fs.readFileSync(path.join(certPath,'request.csr')).toString(),
			passphrase: ''
		}
	},
	default: {
		username: 'munkey'
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
		secret: "",
		cookie: {
			expires: 60 * 60 * 1000 // 1 hour
		}
	},
	db: {
		connection: {
			host: 'localhost',
			port: 3306,
			user: '',
			password: "",
			database: ""
		},
		debug: false
	}
};

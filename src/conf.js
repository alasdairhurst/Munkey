const db = {
	host: 'localhost',
	port: 3306,
	user: "alasdair",
	password: "5b$tns18&6%VjqJ"
};

global.$config = {
	http: {
		port: 8000
	},
	db: {
		main: Object.assign({name: "munkey"}, db),
		sessions: Object.assign({name: "munkey_sessions"}, db)
	}
};

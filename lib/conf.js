"use strict";

var db = {
	host: 'localhost',
	port: 3306,
	user: "alasdair",
	password: "5b$tns18&6%VjqJ"
};

global.$config = {
	http: {
		port: 8000
	},
	default: {
		username: 'alasdair'
	},
	api: {
		path: '/api/v1/'
	},
	db: {
		base: db,
		main: Object.assign({ database: "munkey" }, db)
	}
};
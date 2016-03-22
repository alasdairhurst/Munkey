"use strict";

var db = {
	host: 'localhost',
	port: 3306,
	user: "root",
	password: "root"
};

global.$config = {
	http: {
		port: 8000
	},
	db: {
		main: Object.assign({ name: "munkey" }, db),
		sessions: Object.assign({ name: "munkey_sessions" }, db)
	}
};
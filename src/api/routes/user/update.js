import {GetUser, UpdateUser, MatchPasswords} from 'userdata';

/**
 * Updates user data if user exists
 */
export default {
	path: 'user',
	method: 'put',
	action: function(req, res) {
		// we just want to allow one user for now
		new Promise((resolve, reject) => {
			//if the password is being updated then we want the new password,
			// the confirmation and the current password
			if (req.body.password){
				if (!req.body.password_confirm) {
					return res.status(400).send({success: false, error:'password_confirm required'});
				}
				if (req.body.password != req.body.password_confirm) {
					return res.status(400).send({success: false, error:'password and password_confirm do not match'});
				}
				if (!req.body.password_current) {
					return res.status(400).send({success: false, error:'password_current required'});
				}
			}
			return resolve();
		})
		.then(() => GetUser({fields:['username','password','password_salt']}))
		.then((user) => {
			return new Promise((resolve, reject) => {
				"use strict";
				// validate the session
				if (!req.session.username || req.session.username != user.username) {
					return res.status(403).send({success: false, error: "Not authenticated"});
				}
				resolve(user);
			});
		})
		.then(user => {
			return new Promise((resolve, reject) => {
				if (!user) {
					return res.status(400).send({success: false, error:'User does not exist'});
				}
				const update = {};
				if (req.body.password) {
					// make sure that the current password matches the one stored in the DB
					const password = req.body.password_current;
					if (!MatchPasswords({password, user})) {
						return res.status(400).send({success: false, error:'password_current does not match the password for this user'});
					} else {
						update.password = req.body.password;
					}
				}
				if (req.body.data) {
					update.data = req.body.data;
				}

				resolve({user, update});
			});
		})
		.then(UpdateUser)
		.then(() => res.send({success: true}))
		.catch(err => {
			console.error(err);
			err.message && console.error(err.message);
			err.stack && console.error(err.stack);
			return res.status(err.code||500).send({success: false, error:'server error'});
		});
	}
}
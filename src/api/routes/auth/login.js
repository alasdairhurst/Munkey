import {GetUser, MatchPasswords} from 'userdata';
import Crypto from 'crypto';

/**
 * Login endpoint
 */
export default {
	path: 'auth/login',
	method: 'post',
	action: function(req, res) {
		// we just want to allow one user for now
		new Promise((resolve, reject) => {
			// make sure all the required fields are sent
			if (!req.body.username){
				return res.status(400).send({success: false, error:'username required'});
			}
			if (!req.body.password){
				return res.status(400).send({success: false, error:'password required'});
			}

			return resolve();
		})
		.then(() => GetUser({fields:[
			'username',
			'created_at',
			'updated_at',
			'data',
			'password',
			'password_salt']}))
		.then(user => {
			return new Promise((resolve, reject) => {
				if (!user || user.username != req.body.username) {
					return res.status(401).send({success: false, error:'Invalid login credentials'});
				}
				if (req.body.password) {
					// make sure that the current password matches the one stored in the DB
					const password = req.body.password;
					if (!MatchPasswords({password, user})) {
						return res.status(401).send({success: false, error:'Invalid login credentials'});
					}
				}

				// invalidate existing session
				req.session.regenerate(err => {
					if (err) {
						return reject(err);
					}
					// set new values
					req.session.username = user.username;
					req.session.login_time = new Date;

					// set local password decryption key
					req.session.pdekey = Crypto.randomBytes(512).toString('base64');

					res.send({success: true, result: req.session});
				});
			});
		})
		.catch(err => {
			console.error(err);
			err.message && console.error(err.message);
			err.stack && console.error(err.stack);
			return res.status(err.code||500).send({success: false, error:'server error'});
		});
	}
}
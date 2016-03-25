import {db} from 'db';
import {} from 'userdata';

/**
 * Creates a new user for munKey if none exists.
 */
export default {
	path: 'user',
	method: 'post',
	action: function(req, res, next) {
		// we just want to allow one user for now
		db.query('SELECT username FROM users')
			.then(users => {
				if (users.length) {
					return next({code: 403, message: 'User already exists'});
				}
				const username = global.$config.default.username;
				return res.send({[username]: users});
			})
			.catch(err => {
				return next(err);
			});
	}
}
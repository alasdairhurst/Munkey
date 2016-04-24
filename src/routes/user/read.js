import {GetUser} from 'userdata';

/**
 * Gets the user in the DB
 */
export default {
	path: 'user',
	method: 'get',
	action: function(req, res) {
		GetUser()
			.then((user) => {
				return new Promise((resolve, reject) => {
					// validate the session
					if (!user || !req.session.username || req.session.username != user.username) {
						return res.status(403).send({success: false, error: "Not authenticated"});
					}
					resolve(user);
				})
			})
			.then((user) => res.send({success: true, result: user}))
			.catch(err => {
				console.error(err);
				err.message && console.error(err.message);
				err.stack && console.error(err.stack);
				return res.status(err.code||500).send({success: false, error:'server error'});
			});
	}
}
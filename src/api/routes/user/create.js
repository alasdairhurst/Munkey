import {CreateUser, GetUser} from 'userdata';

/**
 * Creates a new user for munKey if none exists.
 */
export default {
	path: 'user',
	method: 'post',
	action: function(req, res) {
		// we just want to allow one user for now
		new Promise((resolve, reject) => {
			// make sure all the required fields are sent
			if (!req.body.password){
				return res.status(400).send({success: false, error:'password required'});
			}
			if (!req.body.password_confirm) {
				return res.status(400).send({success: false, error:'password_confirm required'});
			}
			if (req.body.password != req.body.password_confirm) {
				return res.status(400).send({success: false, error:'password and password_confirm do not match'});
			}
			return resolve();
		})
		.then(() => GetUser({fields:['username']}))
		.then(user => {
			return new Promise((resolve, reject) => {
				if (user) {
					return res.status(403).send({success: false, error:'User already exists'});
				}
				return resolve({
					username: global.$config.default.username,
					password: req.body.password
				});
			});
		})
		.then(CreateUser)
		.then(() => res.send({success: true}))
		.catch(err => {
			console.error(err);
			err.message && console.error(err.message);
			err.stack && console.error(err.stack);
			return res.status(err.code||500).send({success: false, error:'server error'});
		});
	}
}
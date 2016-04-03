import {GetUser, MatchPasswords} from 'userdata';

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
						return res.status(400).send({success: false, error:'Invalid login credentials'});
					}
					if (req.body.password) {
						// make sure that the current password matches the one stored in the DB
						const password = req.body.password;
						if (!MatchPasswords({password, user})) {
							return res.status(400).send({success: false, error:'Invalid login credentials'});
						}
					}
					req.session.username = user.username;
					req.session.logged_in = true;
					req.session.login_time = new Date;

					delete user.password;
					delete user.password_salt;

					res.send({success: true, result: user});
				});
			})
			.then(() => res.send({success: true}))
			.catch(err => {
				console.error(err);
				err.message && console.error(err.message);
				err.stack && console.error(err.stack);
				return res.status(err.code||500).send({success: false, error:'server error'});
			});
	}
}
import {GetUser} from 'userdata';

/**
 * looks to see if a user account has been set up yet
 */
export default {
	path: 'setup/account',
	method: 'get',
	action: function(req, res) {
		GetUser()
			.then((user) => {
				res.send({success: true, result: !!user})
			})
			.catch(err => {
				console.error(err);
				err.message && console.error(err.message);
				err.stack && console.error(err.stack);
				return res.status(err.code||500).send({success: false, error:'server error'});
			});
	}
}
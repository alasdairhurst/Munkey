const defaultFields = [
	'username'
];

/**
 * Returns the current session if it exists.
 */
export default {
	path: 'auth/session',
	method: 'get',
	action: function(req, res) {
		var result = null;
		if (req.session.username) {
			result = req.session;
		}
		return res.send({success: true, result});
	}
}
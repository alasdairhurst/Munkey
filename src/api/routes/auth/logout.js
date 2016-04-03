/**
 * Logout endpoint
 */
export default {
	path: 'auth/logout',
	method: 'get',
	action: function(req, res) {
		if (req.session.logged_in) {
			req.session.destroy(() => {
				return res.send({success: true});
			});
		} else {
			return res.status(403).send({success:false, error: 'Not authenticated'});
		}
	}
}
define([
	'views/login',
	'views/index',
	'views/setup',
	'views/credentials/viewer',
	'models/user'
],
function(
	LoginView,
    IndexView,
	SetupView,
	CredentialViewerView,
    UserModel
) {
	return Backbone.Router.extend({
		initialize: function() {
			this.route('*action', this.any);
			this.route('', this.index);
			this.route('login', this.login);
			this.route('logout', this.logout);
			this.route('setup', this.setup);
			this.route('credentials/viewer', this.credentialViewer);

		},
		execute: function(callback, args) {
			var freePages = [
				'#/login',
				'#/setup'
			];
			// certain pages can be viewed without having a session
			var canViewWithoutSession = _.some(freePages, function(url) {
				if (!!~['', ' ', '#/'].indexOf(window.location.hash)) {
					return true;
				}
				return _.startsWith(window.location.hash, url);
			});

			// create the user on the window if not already
			if (!window.App.User) {
				window.App.User = new UserModel();
			}

			// we'll check the user
			window.App.User.fetch({
				success: done,
				error: function() {
					if (canViewWithoutSession) {
						return done();
					}
					// user isn't logged in, so prompt
					return window.router.navigate('#/login', {trigger: true});
				}
			});

			function done() {
				if (callback) callback.apply(this, args);
			}

		},
		any: function() {
			window.router.navigate('', {trigger: true});
		},
		login: function() {
			if (window.App.User.get('username')) {
				return window.router.navigate('', {trigger: true});
			}
			new LoginView().render();
		},
		logout: function() {
			// don't care if there's an error or not. just redirect after it's done
			window.App.User.logout({
				success: done,
				error: done
			});
			function done() {
				window.router.navigate('');
				window.location.reload();
			}
		},
		index: function() {
			new IndexView().render();
		},
		setup: function() {
			new SetupView().render();
		},
		credentialViewer: function() {
			new CredentialViewerView().render();
		}
	});
});


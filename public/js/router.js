define([
	'backbone',
	'views/login',
	'views/index',
	'views/setup',
	'views/credentials/viewer',
	'views/credentials/index',
	'models/user',
	'models/session'
],
function(
	Backbone,
	LoginView,
    IndexView,
	SetupView,
	CredentialViewerView,
	CredentialIndexView,
    UserModel,
    SessionModel
) {
	return Backbone.Router.extend({
		initialize: function() {
			this.route('*action', this.any);
			this.route('', this.index);
			this.route('login', this.login);
			this.route('logout', this.logout);
			this.route('setup', this.setup);
			this.route('credentials/new', this.newCredential);
			this.route('credentials/view/:id', this.credentialViewer);
			this.route('credentials', this.credentialList);

		},
		execute: function(callback, args) {
			var freePages = [
				'#/login',
				'#/logout',
				'#/setup'
			];
			// certain pages can be viewed without having a session
			var canViewWithoutSession = _.some(freePages, function(url) {
				if (!!~['', ' ', '#/'].indexOf(window.location.hash)) {
					return true;
				}
				return _.startsWith(window.location.hash, url);
			});

			if (!window.App.Session) {
				window.App.Session = new SessionModel();
			}

			window.App.Session.fetch({
				success: next,
				error: function() {
					if (canViewWithoutSession) {
						return next();
					}
					// show error page maybe?
				}
			});

			function next(model, res) {
				var activeSession = res && res.result;
				if (!activeSession) {
					if (window.App.User) {
						delete window.App.User;
					}
					if (canViewWithoutSession) {
						return done();
					}
					// user isn't logged in, so prompt
					return window.router.navigate('#/login', {trigger: true});
				}
				// there's an active session so now we can check the user
				if (!window.App.User) {
					window.App.User = new UserModel();
					// we'll check the user
					window.App.User.fetch({
						success: done,
						error: function() {
							// just go to logout if there's an error
							return window.router.navigate('#/logout', {trigger: true});
						}
					});
				} else {
					// already a user so continue
					return done();
				}
			}

			function done() {
				if (callback) callback.apply(this, args);
			}

		},
		any: function() {
			window.router.navigate('', {trigger: true});
		},
		login: function() {
			if (window.App.Session.get('username')) {
				return window.router.navigate('', {trigger: true});
			}
			new LoginView().render();
		},
		logout: function() {
			// don't care if there's an error or not. just redirect after it's done
			window.App.Session.logout({
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
		credentialViewer: function(id) {
			new CredentialViewerView({id: id}).render();
		},
		newCredential: function() {
			new CredentialViewerView({isNew: true}).render();
		},
		credentialList: function() {
			new CredentialIndexView().render();
		}
	});
});


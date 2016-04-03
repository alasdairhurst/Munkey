define([
	'views/login',
	'views/index',
	'models/user',
	'models/logout'
],
function(
	LoginView,
    IndexView,
    UserModel,
    LogoutModel
) {
	return Backbone.Router.extend({
		initialize: function() {
			this.route('*action', this.any);
			this.route('', this.index);
			this.route('login', this.login);
			this.route('logout', this.logout);
			this.route('special', this.special);

		},
		execute: function(callback, args) {
			var freePages = [
				'#/login'
			];
			// certain pages can be viewed without having a session
			var canViewWithoutSession = _.some(freePages, function(url) {
				if (!!~['', ' ', '#/'].indexOf(window.location.hash)) {
					return true;
				}
				return _.startsWith(window.location.hash, url);
			});

			/*
			if (canViewWithoutSession) {
				// just continue if no session is needed
				return done();
			}
			*/

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
		login: function() {
			new LoginView().render();
		},
		logout: function() {
			// don't care if there's an error or not. just redirect after it's done
			new LogoutModel().fetch({
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
		special: function() {
			new IndexView().render();
		},
		any: function() {
			return window.router.navigate('', {trigger: true});
		}
	});
});


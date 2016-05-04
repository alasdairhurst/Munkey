define([
	'backbone',
	'crypto',
	'underscore',
	'underscore.string'
], function(
	Backbone,
	Crypto,
	_,
	_s
) {
	return Backbone.Model.extend({
		action: null,
		idAttribute: 'username',
		url: function() {
			if (this.action == 'login') {
				this.action = null;
				return '/api/v1/auth/login';
			} else if (this.action == 'logout') {
				this.action = null;
				return '/api/v1/auth/logout';
			}
			this.action = null;
			return '/api/v1/auth/session';
		},
		parse: function(data) {
			if (data.result) {
				var self = this;
				_.forEach(Object.keys(data.result), function(key) {
					self.set(key, data.result[key]);
				});
			}
		},
		_hashPassword: function(password) {
			if (!this.get('username') || !password) { return null; }
			// hash password
			// This makes sure that the original password is never sent to the server
			// prepend username to password before salting and hashing.
			var opts = {
					iterations: 1000,
					keySize: 512/32
				},
				saltOpts = {
					iterations: 10,
					keySize: 512/32
				},
				unsaltedPassword = this.get('username') + password,
				// create a salt based on the username
				salt = Crypto.PBKDF2(this.get('username'), this.get('username'), saltOpts).toString(Crypto.enc.Base64);
			return Crypto.PBKDF2(unsaltedPassword, salt, opts).toString(Crypto.enc.Base64);
		},
		login: function(opts) {
			this.action = 'login';
			var success = opts.success;
			var self = this;
			opts.success = function() {
				self._setPassword(self.get('masterPassword'));
				localStorage.setItem('username', self.get('username'));
				delete self.attributes.masterPassword;
				delete self.attributes.confirmMasterPassword;
				delete self.attributes.password;
				delete self.attributes.confirmPassword;
				success && success.apply(this, arguments);
			};
			this.save(null, _.extend({
				type: 'POST'
			}, opts));
		},
		logout: function(opts) {
			this.clear();
			localStorage.clear();
			delete window.App.User;
			delete window.App.Session;
			this.action = 'logout';
			this.fetch(opts);
		},
		_setPassword: function(password, key) {
			if (!password) { return; }
			if (!key) {
				if (!this.get('pdekey')) {
					return;
				}
				key = this.get('pdekey');
			}
			localStorage.setItem('password', Crypto.AES.encrypt(password, key));
		},
		_getPassword: function(key) {
			if (!localStorage.getItem('password')) { return null; }
			if (!key) {
				if (!this.get('pdekey')) {
					return null;
				}
				key = this.get('pdekey');
			}
			return Crypto.AES.decrypt(localStorage.getItem('password'), key).toString(Crypto.enc.Utf8);
		},
		toJSON: function() {
			var json = _.clone(this.attributes);

			// hash the passwords and set them on the new object
			if (json.masterPassword) {
				json.password = this._hashPassword(json.masterPassword);
				delete json.masterPassword;
			}
			if (json.masterPasswordConfirm) {
				json.passwordConfirm = this._hashPassword(json.masterPasswordConfirm);
				delete json.masterPasswordConfirm;
				delete this.attributes.masterPasswordConfirm;
			}
			return json;
		}
	});
});
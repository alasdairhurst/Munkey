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
			return '/api/v1/user';
		},
		parse: function(data) {
			if (data.result) {
				if (data.result.data && localStorage.getItem('password')) {
					data.result.data = this._decryptData(data.result.data);
				}
				var self = this;
				_.forEach(Object.keys(data.result), function(key) {
					self.set(key, data.result[key]);
				});
			}
		},
		login: function(opts) {
			this.action = 'login';
			var success = opts.success;
			var self = this;
			opts.success = function() {
				// encrypt this using something
				localStorage.setItem('password', self.get('masterPassword'));
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
			delete window.App.UserData;
			this.action = 'logout';
			this.fetch(opts);
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
				saltSalt = 'thisShouldBeInAConfig',
				// create a salt based on the username
				salt = Crypto.PBKDF2(this.get('username'), saltSalt, saltOpts).toString(Crypto.enc.Base64);
			return Crypto.PBKDF2(unsaltedPassword, salt, opts).toString(Crypto.enc.Base64);
		},
		_encryptData: function(data) {
			if (data && localStorage.getItem('password')) {
				return Crypto.AES.encrypt(JSON.stringify(data), localStorage.getItem('password')).toString();
			} else {
				return null;
			}
		},
		_decryptData: function(data) {
			if (data && localStorage.getItem('password')) {
				var decData = Crypto.AES.decrypt(data, localStorage.getItem('password')).toString(Crypto.enc.Utf8);
				return JSON.parse(decData);
			} else {
				return null;
			}
		},
		clear: function() {
			Backbone.Model.prototype.clear.apply(this, arguments);
		},
		toJSON: function() {
			var json = _.clone(this.attributes);

			// encrypt the data before sending it back
			if (json.data && localStorage.getItem('password')) {
				json.data = this._encryptData(json.data);
			} else {
				// if we can't encrypt it, don't send it.
				delete json.data;
			}

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
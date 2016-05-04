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
		idAttribute: 'id',
		url: '/api/v1/user',
		parse: function(data) {
			if (data.result) {
				var password = window.App.Session._getPassword();
				if (data.result.data && password) {
					data.result.data = this._decryptData(data.result.data, password);
				}
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
		_encryptData: function(data, password) {
			if (data && password) {
				return Crypto.AES.encrypt(JSON.stringify(data), password).toString();
			} else {
				return null;
			}
		},
		_decryptData: function(data, password) {
			if (data && password) {
				var decData = Crypto.AES.decrypt(data, password).toString(Crypto.enc.Utf8);
				try {
					return JSON.parse(decData);
				} catch(e) {
					// failed to parse. invalid data. logout.
					window.router.navigate('#/logout', {trigger: true});
				}
			}
			return null;
		},
		toJSON: function() {
			var json = _.clone(this.attributes);

			// encrypt the data before sending it back
			var password = window.App.Session._getPassword();
			if (json.data && password) {
				json.data = this._encryptData(json.data, password);
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
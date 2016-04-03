define([
	'backbone'
], function(
	Backbone
) {
	return Backbone.Model.extend({
		url: '/api/v1/user',
		parse: function(data) {
			var self = this;
			_.forEach(Object.keys(data.result), function(key) {
				self.set(key, data.result[key]);
			});
		}
	})
});
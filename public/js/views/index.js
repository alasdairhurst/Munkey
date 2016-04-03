define([
	'backbone',
	'tpl!/js/views/templates/index.html'
], function(
	Backbone,
	Template
) {
	return Backbone.View.extend({
		el: 'body #content',
		initialize() {
			this.options = {};
			this.options.username = window.App.User && window.App.User.get('username');
			this.options.loggedIn = !!this.options.username;
		},
		render: function() {
			this.$el.html(Template(this.options));
		}
	})
});
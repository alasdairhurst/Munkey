define([
	'backbone',
	'tpl!/js/views/credentials/templates/index.html'
], function(
	Backbone,
	Template
) {
	return Backbone.View.extend({
		events: {
			'click #creds .delete-btn': 'removeField',
			'click #creds #back-btn' : 'back'
		},
		el: 'body #content',
		model: null,
		options: {},
		initialize(options) {
			this.options = options || {};
			this.model = window.App.User;
			this.options.data = this.options.data || this.model.get('data');
			if (!this.options.data) {
				this.options.data = {
					credentials: []
				}
			}
		},
		render: function() {
			this.$el.html(Template(this.options));
		},
		removeField: function(e) {
			var field = $(e.currentTarget);
			var i = field.parent().parent().attr('id');
			field.parent().parent().remove();
			delete this.options.data.credentials[i];
			this.model.save();
		},
		back: function() {
			this.remove();
			window.router.navigate('/', {trigger: true});
		},
		remove: function() {
			this.undelegateEvents();
			this.$el.empty();
			this.stopListening();
			return this;
		}
	})
});
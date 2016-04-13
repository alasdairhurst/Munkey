define([
	'backbone',
	'tpl!/js/views/templates/login.html'
], function(
	Backbone,
    Template
) {
	return Backbone.View.extend({
		el: 'body #content',
		events: {
			'change #login input': 'fieldChanged',
			'click #login #submit': 'submit'
		},
		model: null,
		initialize() {
			this.model = window.App.Session;
		},
		render: function() {
			this.$el.html(Template({}));
		},
		fieldChanged: function(e) {
			var field = $(e.currentTarget);
			var data = {};
			data[field.attr('id')] = field.val();
			this.model.set(data);
		},
		submit: function(e) {
			e.preventDefault();
			var self = this;
			$('#submit').val('Logging in...');
			// it won't update the DOM until the end of the frame so defer this call
			setTimeout(function() {
				self.model.login({
					success: function() {
						self.remove();
						window.router.navigate('', {trigger: true});
					},
					error: function(model, response) {
						$('#submit').val('Submit');
						$(self.$el).find('#response').html(response && response.responseJSON && response.responseJSON.error || 'An Error Occurred');
					}
				});
			},0);
		},
		remove: function() {
			this.undelegateEvents();
			this.$el.empty();
			this.stopListening();
			return this;
		}
	})
});
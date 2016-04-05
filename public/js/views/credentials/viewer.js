define([
	'tpl!/js/views/credentials/templates/viewer.html'
], function(
	Template
) {
	return Backbone.View.extend({
		el: 'body #content',
		events: {
			'change #viewer textarea': 'fieldChanged',
			'click #viewer #submit': 'submit'
		},
		model: null,
		options: {},
		initialize() {
			this.model = window.App.User;
			this.options.data = this.model.get('data');
			if (!this.options.data) {
				this.options.data = {
					credentials: ''
				}
			}
			console.log(this.options.data);
		},
		render: function() {
			this.$el.html(Template(this.options));
		},
		fieldChanged: function(e) {
			var field = $(e.currentTarget);
			if (field.attr('id') == 'credentials') {
				this.options.data.credentials = field.val();
				this.model.set('data', this.options.data);
			}
		},
		submit: function(e) {
			e.preventDefault();
			var self = this;
			$('#submit').val('Saving...');
			// it won't update the DOM until the end of the frame so defer this call
			setTimeout(function() {
				self.model.save(null, {
					success: function() {
						$('#submit').val('Submit');
					},
					error: function(model, response) {
						$('#submit').val('Submit');
						$(self.$el).find('#response').html(response.responseJSON.error);
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
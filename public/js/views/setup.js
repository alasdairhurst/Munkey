define([
	'../models/user',
	'../models/account',
	'tpl!/js/views/templates/setup.html'
], function(
	UserModel,
	AccountModel,
	Template
) {
	return Backbone.View.extend({
		el: 'body #content',
		events: {
			'change #setup input': 'fieldChanged',
			'click #setup #submit': 'submit'
		},
		model: null,
		options: {},
		initialize() {
			this.model = window.App.User || new UserModel();
		},
		render: function() {
			var self = this;
			new AccountModel().fetch({
				success: function(model, response) {
					self.options.hasAccount = response.result;
					self.$el.html(Template(self.options));
				}
			});
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
			$('#submit').val('Saving...');
			// it won't update the DOM until the end of the frame so defer this call
			setTimeout(function() {
				self.model.save(null, {
					success: function() {
						self.remove();
						window.router.navigate('login', {trigger: true});
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
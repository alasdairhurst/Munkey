define([
	'../models/login',
	'../models/user',
	'tpl!/js/views/templates/login.html'
], function(
    LoginModel,
    UserModel,
    Template
) {
	return Backbone.View.extend({
		el: 'body #content',
		events: {
			"change input": "fieldChanged",
			"submit": "submit"
		},
		initialize() {
			this.model = new LoginModel();
		},
		render: function() {
			$(this.el)
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
			this.model.save(null, {
				type: 'POST',
				success: function(model, response) {
					window.App.User = new UserModel(response.result);
					self.remove();
					window.router.navigate('', {trigger: true});

				},
				error: function(model, response) {
					$(self.$el).find('#response').html(response.responseJSON.error);
				}
			});
		},
		remove: function() {
			this.undelegateEvents();
			this.$el.empty();
			this.stopListening();
			return this;
		}
	})
});
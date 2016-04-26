define([
	'backbone',
	'uuid',
	'tpl!/js/views/credentials/templates/viewer.html',
	'tpl!/js/views/credentials/templates/field.html'
], function(
	Backbone,
	uuid,
	Template,
    FieldTemplate
) {
	return Backbone.View.extend({
		el: 'body #content',
		events: {
			'change #viewer input': 'fieldChanged',
			'click #viewer .delete-btn': 'removeField',
			'click #viewer #submit': 'submit',
			'click #viewer #add': 'addField',
			'click #viewer #back-btn' : 'back'
		},
		model: null,
		options: {},
		initialize(options) {
			this.undelegateEvents();
			this.delegateEvents();
			this.stopListening();
			this.options = options || {};
			this.model = window.App.User;
			this.options.data = this.model.get('data');
			if (this.options.isNew) {
				this.options.id = uuid.v4();
				if (!this.options.data || !this.options.data.credentials) {
					this.options.data = {
						credentials: {}
					}
				}
				var nameID = uuid.v4();
				this.options.data.credentials[this.options.id] = {
					id: this.options.id,
					nameID: nameID,
					fields: {}
				};
				this.options.data.credentials[this.options.id].fields[nameID] = {
					name: 'Name',
					locked: true,
					value: '',
					obscured: false
				}
			} else {
				this.options.isNew = false;
			}
			this.options.credential = this.options.data.credentials[this.options.id];
		},
		render: function() {
			this.$el.html(Template(this.options));
			var self = this;
			_.each(this.options.credential.fields, function(field, i) {
				self.$el.find('#data').append(FieldTemplate({field: field, index:i}));
				self.obscureField(i, field.obscured);
			});
		},
		fieldChanged: function(e) {
			var field = $(e.currentTarget);
			var i = field.parent().parent().attr('id');
			var type = field.attr('data-type');
			var val = field.val();
			if (type == 'obscured') {
				val = field.prop('checked');
				this.obscureField(i, val);
			}
			this.options.credential.fields[i][type] = val;
		},
		addField: function() {
			var index = uuid.v4();
			var field = this.options.credential.fields[index] = {
				name: '',
				locked: false,
				value: '',
				obscured: false
			};
			this.$el.find('#data').append(FieldTemplate({field: field, index:index}));
		},
		removeField: function(e) {
			var field = $(e.currentTarget);
			var i = field.parent().parent().attr('id');
			field.parent().parent().remove();
			delete this.options.credential.fields[i];
		},
		obscureField: function(id, hide) {
			var field = this.$el.find('#' + id).find("[data-type=\'value\']");
			var amount = hide ? 'blur(5px)' : '';
			var legacy = hide ? 'url(\'/images/blur.svg#blur\')' : '';
			field.css('-webkit-filter', amount); /* Chrome, Opera, etc. */
			field.css('filter', legacy); /* Older FF and others - http://jordanhollinger.com/media/blur.svg */
			field.css('filter', amount); /* Firefox 35+, eventually all */
		},
		submit: function(e) {
			e.preventDefault();
			var self = this;
			this.model.set('data', this.options.data);
			$('#submit').val('Saving...');
			// it won't update the DOM until the end of the frame so defer this call
			setTimeout(function() {
				self.model.save(null, {
					success: function() {
						$('#submit').val('Submit');
						self.remove();
						window.router.navigate('/credentials', {trigger: true});
					},
					error: function(model, response) {
						$('#submit').val('Submit');
						$(self.$el).find('#response').html(response.responseJSON.error);
					}
				});

			},0);

		},
		back: function() {
			this.remove();
			window.router.navigate('/credentials', {trigger: true});
		},
		remove: function() {
			this.undelegateEvents();
			this.$el.empty();
			this.stopListening();
			return this;
		}
	})
});
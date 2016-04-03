require.config({
	paths: {
		'backbone': '../bower/backbone/backbone',
		'underscore': '../bower/underscore/underscore',
		'underscore.string': '../bower/underscore.string/dist/underscore.string.min',
		'jquery': '../bower/jquery/dist/jquery',
		'text': '../bower/text/text',
		'tpl': '../bower/requirejs-tpl/tpl'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		jquery: {
			exports: '$'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: 'Backbone'
		}
	}
});

define([
	'router',
	'underscore',
	'underscore.string',
	'backbone',
	'jquery'
], function(
    Router,
    _,
    _s,
    Backbone,
    $
) {
	_.mixin(_s.exports());
	window.App = {};
	window.router = new Router();
	Backbone.history.start();
});
require.config({
	paths: {
		'underscore': '../bower/underscore/underscore',
		'underscore.string': '../bower/underscore.string/dist/underscore.string.min',
		'backbone': '../bower/backbone/backbone',
		'jquery': '../bower/jquery/dist/jquery',
		'text': '../bower/text/text',
		'tpl': '../bower/requirejs-tpl/tpl',
		'crypto': '../bower/crypto-js/crypto-js'
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
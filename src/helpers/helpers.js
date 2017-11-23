module.exports.register = function(Handlebars, options) {
  'use strict';

	/// This is a custom helper to generate a SVG background.
	/// Usage:
	/// {{menu item}}
	Handlebars.registerHelper('menu', function(menuItem) {
		var output = ['<li id="', menuItem['id'], '"> <a href="#" data-gotoslide="', menuItem['gotoslide-id'], '">', menuItem['name'], '</a></li>']
		return new Handlebars.SafeString(output.join(''));
	});

	/// This is a custom helper to generate a SVG background.
	/// Usage:
	/// {{menu item}}
	Handlebars.registerHelper('debug', function(debug) {
		var obj = {context: this, debug: debug || ''};
		console.log(obj);
		return new Handlebars.SafeString(JSON.stringify(obj));
	});

};
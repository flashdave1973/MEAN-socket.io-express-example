
var express = require('express');

module.exports = function(app, io){

	// Set .html as the default template extension
	app.set('view engine', 'html');

	// Initialize the ejs template engine
	app.engine('html', require('ejs').renderFile);

	// template views
	app.set('views', __dirname + '/views');

	// public folder  
	app.use(express.static(__dirname + '/public'));

};

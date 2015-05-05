
var express = require('express')
,	mongoose = require('mongoose')
,	router = express.Router()
,	app = express()
,	port = process.env.PORT || 8080
,	io = require('socket.io').listen( app.listen(port) );

// connect MongoDB
mongoose.connect('mongodb://localhost/the-simple');

require('./config')(app, io);
require('./routes')(app, router, mongoose, io);

console.log('Your application is running on http://localhost:' + port);
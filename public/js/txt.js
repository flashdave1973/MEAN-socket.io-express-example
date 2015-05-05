// executed by the browser

$(function(){

	// connect to the socket
	var socket = io();

	// cache jQuery objects
	var h1 = $("h1")
	,	txt = $(".txt")
	,	form = $("#form")
	,	viewers = $(".watchers span");

	// on connection to server set room 1
	socket.on('connect', function(){
		socket.emit('load', 1);
	});

	// receive inital msg 
	socket.on('loadMsg', function(data){
		h1.html( data.msg );
		txt.val( data.msg );
	});

	// receive watchers to set viewers 
	socket.on('watchers', function(data){
		viewers.html( data.number );

	});

	// receive disconnect notice of a connection 
	socket.on('leave',function( data ){
		var watchers = parseInt( $(".watchers span").html() ) - 1;
		viewers.html( watchers );
	});

	// receive  msg from user
	socket.on('msg', function(data){
		h1.html( data.msg );
		txt.val( data.msg );
	});

	// on keypress emit msg
	txt.keypress(function(e){
		socket.emit('msg', {id:1, msg: $(".txt").val() + String.fromCharCode(e.charCode)});
	});

});

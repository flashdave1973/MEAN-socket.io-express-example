
module.exports = function(app, router, mongoose, io){
	var morgan = require('morgan')
	,	txtMsg = mongoose.model('Msg', { _id: false, msg: String });
	app.get('/', function(req, res){ 
		res.render('txt'); 
	});


	// Initialize a new socket.io application
	var connector = io.on('connection', function ( socket ) {
		socket.on('load',function( data ){ 
			socket.room = data;
			socket.join( data ); 
			var roomId = data
			,	room = findClientsSocket( io, roomId );
			socket.emit('watchers', { number: room.length + 1 });
			socket.broadcast.to(socket.room).emit('watchers', { number: room.length + 1 });
			txtMsg.findById(1, function(err, dbData) {
				if (dbData){
					socket.emit('loadMsg', { msg: dbData.msg });
				}
			});

		}); 

		socket.on('msg',function( data ){ 
			var room = findClientsSocket( io, data.id );
			socket.broadcast.to(socket.room).emit('msg', { msg: data.msg});
			txtMsg.findById(1, function(err, dbData) {
				if (!dbData){
					var db =  txtMsg({ _id: 1, msg: data.msg });
					db.save();
				}else {
					dbData.msg =data.msg;
					dbData.save();
				}
			});
		});

		//  a disconnect from the connector
		socket.on('disconnect', function() {
			socket.broadcast.to(socket.room).emit('leave', { boolean: true,	room: 1	});
			socket.leave( 1 );
		});
	});
};

function findClientsSocket( io, roomId, namespace) {
	var res = [],
		ns = io.of(namespace ||"/");    // the default namespace is "/"

		if (ns) {
			for (var id in ns.connected) {
				if(roomId) {
					var index = ns.connected[id].rooms.indexOf(roomId) ;
					if(index !== -1) {
						res.push(ns.connected[id]);
					}
				}
				else {
					res.push(ns.connected[id]);
				}
			}
		}
		return res;
	}
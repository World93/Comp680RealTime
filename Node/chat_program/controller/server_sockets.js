/**
 * New node file
 */



var number_in_room = 0;
var room_number = 0;
var room_min_size = 2;
var room_max_size = 2;
var room_object = require("./socket_rooms");
var wait_rooms = new room_object(room_min_size, room_max_size);

module.exports = function(io) {

	
	function emit_new_message(socket, msg, emit_to) {
		var rooms = socket.adapter.rooms;
		rooms = wait_rooms.find_room_by_socket_id(socket, socket.id, rooms);
		if (typeof msg['for'] != "undefined"
				&& msg['for'].toLowerCase() === 'not_me') {
			while (rooms.length > 0) {
				socket.broadcast.to(rooms.pop()).emit(emit_to, {
					'msg' : msg.msg,
				});
			}
		} else {
			while (rooms.length > 0) {
					io.to(rooms.pop()).emit(emit_to, {
						'msg' : msg.msg,
					});
			}
		}
	}
	
	
	io.sockets.on('connection', function(socket) {
		socket.emit('connection_status', {
			msg : "Connection Successful"
		});// Send
		// information
		// about
		// successful
		// connection

		socket.on('disconnect', function() {

		});

		// Overwrite the default socket connection for on-close
		// Allows operations to be performed before the object is deleted
		socket.onclose = function(reason) {
			// emit to rooms here
			emit_new_message(socket, {
				msg : "user disconnect"
			}, "user_disconnected");
			Object.getPrototypeOf(this).onclose.call(this, reason);
		}

		// User wants to join a game
		socket.on('join_game', function(msg) {
			var room_info = wait_rooms.add_to_room(socket);
			var room_num = room_info.room;

			socket.join(room_num);

			io.to(socket.id).emit('you_join', {// Send message to user
				// based on their room
				'msg' : msg.msg,
				'room_number' : room_num,
				'player_number' : room_info.user_number
			});

			emit_new_message(socket, {
				'msg' : msg.msg,
				'for' : 'not_me'
			}, "user_join");

			if (room_info.full) {
				emit_new_message(socket, {
					'msg' : 'Game Start'
				}, "game_start");
			}

		});

		socket.on('user_disconnecting', function(msg) {
			emit_new_message(socket, msg, "user_disconnected");
			socket.disconnect();
		});

		socket.on('game_message', function(msg) {// Emit a game message
			emit_new_message(socket, msg, 'game_update');
		});

	});
};
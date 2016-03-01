/**
 * New node file
 */

var uuid = require('node-uuid');

function emit_new_message(socket, msg, emit_to) {
	var rooms = socket.adapter.rooms;
	rooms = wait_rooms.find_room_by_socket_id(socket.id, rooms);
	if (msg['for'].toLowerCase() == 'not_me') {
		socket.broadcast.to(rooms.pop()).emit(emit_to, {
			'msg' : msg.msg,
		});
	} else {
		socket.to(rooms.pop()).emit(emit_to, {
			'msg' : msg.msg,
		});
	}
}

var number_in_room = 0;
var room_number = 0;
var room_min_size = 2;
var room_max_size = 2;
var wait_rooms = new waiting_rooms(room_min_size, room_max_size);

module.exports = function(io) {

	//Notify users remaaining in room that user has disconnected
	var user_diconnected = function(socket,msg){
		var rooms = wait_rooms.find_room_by_socket_id(socket.id, rooms);
		if (rooms.length > 0) {
			io.to(rooms.pop()).emit('user_disconnected', {
				'msg' : msg.msg
			});
		} else {// Send failure message

		}
	}
	
	io.sockets.on('connection', function(socket) {
		socket.emit('connection_status', "Connection Successful");// Send
		// information
		// about
		// successful
		// connection

		socket.on('disconnect', function(socket) {
			console.log(socket.id);
			user_diconnected(socket,{msg:"user disconnect"});
		});

		// User wants to join a game
		socket.on('join_game', function(msg) {
			var room_info = wait_rooms.add_to_room(socket);
			var room_num = room_info.room;

			socket.join(room_num);

			io.to(socket.id).emit('user_join', {// Send message to user
				// based on their room
				'msg' : msg.msg,
				'room_number' : room_num,
				'player_number' : room_info.user_number
			});

			if (room_info.full) {
				io.to(room_num).emit('game_start', {// Send message to user
					msg:"Game Start"
				});

			}

		});

		socket.on('user_disconnecting', function(msg) {
			user_diconnected(socket,msg);
		});

		socket.on('game_message', function(msg) {// Emit a game message
			emit_new_message(socket, msg.msg, 'game_update');
		});
		
		

	});
};
/**
 * New node file
 */



function waiting_rooms(min_room_size, max_room_size) {
	this.room_waiting = [0];
	this.number_in_room = 0;
	this.add_to_room = function(user_socker) {
		if(this.number_in_room >= max_room_size){
			this.room_waiting[0] = uuid.v1();
			this.number_in_room = 0;
		}
		this.number_in_room++;
		return {'room':this.room_waiting[0],'user_number':this.number_in_room,'full':this.number_in_room >= max_room_size};
		
	}

	this.find_room_by_socket_id = function(socket_id, rooms) {// Find the room
																// the user
																// resides in
		var return_value = [];
		return_value.push(-1);
		for ( var key in rooms) {
			if (typeof rooms[key] === 'object') {
				if (search_object_key(rooms[key].sockets, socket_id) === true) {

					if (null !== rooms[key].length
							&& rooms[key].length >= min_room_size) {
						return_value.push(key);
					} else {
						// Current_socket_room
						return_value[0] = key;// Only room the user is in is
												// his own
					}

				}

			}
		}
		return return_value;

	}

}

function search_object_key(obj, value) {
	for ( var key in obj) {

		if (typeof obj[key] === 'object') {
			searchObj(obj[key]);
		}

		if (key === value) {
			return true;
		}

	}
	return false;
}

function search_object(obj, value) {
	for ( var key in obj) {

		if (typeof obj[key] === 'object') {
			searchObj(obj[key]);
		}

		if (obj[key] === value) {
			return true;
		}

	}
}
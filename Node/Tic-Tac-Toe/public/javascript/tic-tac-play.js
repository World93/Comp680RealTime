/**
 * Contains all moves neccessary to play tic-tac-toe
 */
var socket = io.connect("http://localhost:3000");// Create a socket
var user_letter;
// Socket Information
socket.on('user connect', function(msg) {
	user_letter = msg.player_number == 1 ? "X" : "O";// Find out if the user
	// is the first or
	// second player
	if (user_letter == "X") {
		waiting_for_user = true;
	}

});

$(document).ready(function() {
	var waiting_for_user = false;
	var board_length = 3;
	$(".tic-tac-board td").on('click', function() {
		if (!waiting_for_user) {
			update_board($(this));// Update the board
			send_move();
		}
	});
	
	var reset_board = function(){
		$.each($(".tic-tac-board td"), function(val, index) {// Create
			$(val).text("");//Set the text to empty
		});
	};
	
	// Update the board
	var update_board = function(position) {
		if ($(position).text() === "" && !waiting_for_user) {
			$(position).text(user_letter);
		}
	};

	var game_finished = function(board){//Check if a win condition has been met
		var number_in_row = 0;
		var row_length = board_length;
		var jump = 1;
		//Check rows
		for(var i=0;i<row_length;i++){
			for(var j=0;j<row_length-1;j++){
				if(board[(i*row_length)]==(board[(i*row_length)+jump])){
					number_in_row++;
				}
			}
			
			if(number_in_row == row_length-1){
				return true;//Game has finished
			}else{
				number_in_row==0;
			}
		}
		
		number_in_row==0;
		
		//Check Columns
		for(var i=0;i<row_length;i++){
			for(var j=0;j<row_length-1;j++){
				if(board[(row_length*j)+i]==(board[((row_length*j)+i) + row_length])){
					number_in_row++;
				}
			}
			
			if(number_in_row == row_length-1){
				return true;//Game has finished
			}else{
				number_in_row==0;
			}
		}
		
		number_in_row==0;
		
		//Check Angles
		for(var i=0;i<row_length;i++){
			for(var j=0;j<row_length-1;j++){
				if(board[(row_length*j)+i]==(board[((row_length*j)+i) + row_length])){
					number_in_row++;
				}
			}
			
			if(number_in_row == row_length-1){
				return true;//Game has finished
			}else{
				number_in_row==0;
			}
		}
		
		
	}
	
	var send_move = function(move) {
		var array_list = $.map($(".tic-tac-board td"), function(val, index) {// Create
			// an
			// array
			// containing
			// the
			// map
			// of
			// the
			// board
			if ($(val).text() == 'X') {
				return "X";
			} else if ($(val).text() == "O") {
				return "O";
			} else {
				return "";
			}

		});
		
		var win = game_finished(array_list);
		socket.emit('game message', {
			'msg' : array_list,
			'for' : "not_me",
			'win' : "win"
		});
		waiting_for_user = true;
		if(win){
			alert("Win");
		}
		// Send the board move

	};

	socket.on('game message', function(msg) {// Update the board when a
												// response
		// is given
		var board_pos = $(".tic-tac-board td");
		for (var i = 0; i < board_pos.length; i++) {
			$(board_pos[i]).text(msg.msg[i]);
		}
		waiting_for_user = false;

	});
	

});
/*
 * Contains all moves neccessary to play tic-tac-toe
 */

var user_letter;

$(document)
		.ready(
				function() {
					var waiting_for_user = false;
					var board_length = 3;
					var options = {
						onUserJoin : userJoin,// User joins lobby
						onRecievePacket : update_board_msg, // User recieves
						// data packet
						onGameStart : gameStart,// Lobby is full, user can begin
						// game
						connectionStatus : change_communication,
						// Connection has been made successfully
						onOtherUserDisconnect : onOtherUserDisconnection
					};

					function userJoin(msg) {

					}

					// Show the user green when connected, red when not
					function change_communication(msg) {
						$(".circle").toggleClass("connected");
						$(".circle").toggleClass("disconnected");
					}

					function gameStart(msg) {
						alert("Game Start");
						user_letter = msg.msg.player === 1 ? "X" : "O";
						if (user_letter == "X") {
							waiting_for_user = false;
						}
						$("#Player_Letter").html(user_letter);
					}

					var game = $.fn.ClientGame("localhost:1992", 4, options);
					waiting_for_user = true;
					game.connectToServer();
					game.joinGame({
						'msg' : "HelloGame"
					});
					$(".tic-tac-board td").on('click', function() {
						if (!waiting_for_user) {
							update_board($(this));// Update the board
							send_move();
						}
					});

					var reset_board = function() {
						$.each($(".tic-tac-board td"), function(index,val) {// Create
							$(val).text("");// Set the text to empty
						});
						waiting_for_user =true;
					};

					// Update the board
					var update_board = function(position) {
						if ($(position).text() === "" && !waiting_for_user) {
							$(position).text(user_letter);
						}
					};

					var game_finished = function(board) {// Check if a win
						// condition has
						// been met
						var number_in_row = 0;
						var row_length = board_length;
						// Check rows
						for (var i = 0; i < row_length; i++) {
							for (var j = 0; j < row_length - 1; j++) {
								if (board[(i * row_length) + j] == (board[(i * row_length)
										+ j + 1])
										&& board[(i * row_length) + j] != "") {
									number_in_row++;
								}
							}

							if (number_in_row == row_length - 1) {
								return true;// Game has finished
							} else {
								number_in_row = 0;
							}
						}

						number_in_row == 0;

						// Check Columns
						for (var i = 0; i < row_length; i++) {
							for (var j = 0; j < row_length - 1; j++) {
								if (board[(row_length * j) + i] == (board[((row_length * j) + i)
										+ row_length])
										&& board[(row_length * j) + i] != "") {
									number_in_row++;
								}
							}

							if (number_in_row == row_length - 1) {
								return true;// Game has finished
							} else {
								number_in_row = 0;
							}

						}

						number_in_row == 0;
						var number_in_second_angle = 0;
						// Check Angles

						for (var j = 0; j < row_length - 1; j++) {
							if (board[(j * row_length) + j] == (board[((j + 1) * row_length)
									+ j + 1])
									&& board[(j * row_length) + j] != "") {
								number_in_row++;
							}
							if (board[(row_length - 1) + ((row_length - 1) * j)] == board[(row_length - 1)
									+ ((row_length - 1) * (j + 1))]
									&& board[(row_length - 1)
											+ ((row_length - 1) * j)] != "") {
								number_in_second_angle++;
							}
						}

						if (number_in_row == row_length - 1
								|| number_in_second_angle == row_length - 1) {
							return true;// Game has finished
						}
						{
							number_in_row = 0;
						}

					}

					var send_move = function(move) {
						var array_list = $.map($(".tic-tac-board td"),
								function(val, index) {// Create
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
						game.passGameData({
							'msg' : array_list,
							'for' : "not_me",
							'win' : win
						});

						waiting_for_user = true;

						if (win) {
							alert("Win");
						}
						// Send the board move

					};

					function update_board_msg(msg) {// Update the board when a
						// response
						// is given
						var board_pos = $(".tic-tac-board td");
						for (var i = 0; i < board_pos.length; i++) {
							$(board_pos[i]).text(msg.msg.msg[i]);
						}
						var win = game_finished(msg.msg.msg);
						if (win) {
							alert("Lost");
						}
						waiting_for_user = false;

					}

					// A user other than the current user has disconnected
					function onOtherUserDisconnection(msg) {
						if (confirm('Oppenent Disconnected. Would you like to play a new game?')) {
							reset_board();
							game.joinGame("Player Joined");
						} else {

						}

					}

				});

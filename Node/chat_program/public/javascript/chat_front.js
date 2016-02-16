/**
 * New node file
 */

var socket = io.connect();//Create a socket

//Send a message
$("form").submit(function(event){
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	event.preventDefault();
	return false;
});

//Find returned messages
socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg.msg));
  });

socket.on('user connect', function(msg){
	$('#messages').append($('<li><b>' + msg.msg + '</b></li>'));
});
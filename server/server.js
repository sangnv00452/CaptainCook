var io = require("socket.io").listen(8080);

var RoomManager = require("./roomManager.js");
var roomManager = new RoomManager(io);
var rooms = [];
io.sockets.on("connection",function(socket){
	console.log("connected!");
	socket.on("newPlayer",function(userName){
		socket.playerName = userName;
		roomManager.addPlayer(socket);
	});
	
	socket.on("disconnect",function(){
		console.log(socket.playerName + " has disconnected !");
		roomManager.leaveRoom(socket);
	})
});

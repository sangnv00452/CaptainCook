var Room = require("./room");
var roomStatus = require("./gameVars").roomStatus;
(function(){
	var RoomManager = function (io){
		this.io = io;
	}
	RoomManager.prototype.rooms = [];

	RoomManager.prototype.addPlayer = function(socket){
		var currentRoom;
		for(var i = 0;i<this.rooms.length;i++){
			currentRoom = this.rooms[i];
			if(currentRoom.status !== roomStatus.FULL){
				currentRoom.joinRoom(socket);
				return;
			}
			
			/*
			if(currentRoom.status == roomStatus.EMPTY){
							currentRoom.addPlayer(socket);
							currentRoom.status = roomStatus.WAITING;
							console.log("In old room");
							console.log(socket.playerName + " has joined " + currentRoom.name +" and waiting!" );
							socket.emit("msg","You have join in to room" + currentRoom.name + ", please wait for other player");
							
							return; 
						}else if(currentRoom.status == roomStatus.WAITING){
							currentRoom.addPlayer(socket);
							currentRoom.status = roomStatus.FULL;
							
							console.log("In old room");
							console.log(socket.playerName + " has joined " + currentRoom.name +" and start!" );
								
							socket.emit("msg","You have join in to room" + currentRoom.name + ", please wait for start game");
							socket.broadcast.to(currentRoom.name).emit("msg","Other player has join this room , please wait for start game");
							
							currentRoom.startGame();
							return;
							
						}*/
			
		}
		
		var newRoom = new Room(this.io,(""+ this.rooms.length));
		newRoom.joinRoom(socket);
		this.rooms.push(newRoom);
		
		console.log("Create new room");
		console.log(socket.playerName + " has joined " + newRoom.name +" and waiting!" );
		socket.emit("msg","You have join in to room" + newRoom.name + ", please wait for other player");
		console.log(this.io.sockets.manager.rooms);
	};
	RoomManager.prototype.leaveRoom = function(socket){
		var currentRoom = this.rooms[socket.room];
		if(currentRoom.status == roomStatus.FULL){
			currentRoom.status = roomStatus.WAITING;
			console.log(socket.playerName + "has left room "+ currentRoom.name);
			console.log(currentRoom.name +" is waiting room " );
			
		}else if(currentRoom.status == roomStatus.WAITING){
			currentRoom.status = roomStatus.EMPTY;
		}
	}
	
	module.exports = RoomManager;
})();


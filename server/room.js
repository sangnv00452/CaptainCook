var GameManager = require("./gameManager");
var GameVars = require("./gameVars");

var cls = require("./lib/class");

module.exports = Room = cls.Class.extend({
	init : function(io,roomName){
		this.io = io;
		this.name = roomName;
		this.status = GameVars.roomStatus.EMPTY;
		this.game = new GameManager();
	},
	joinRoom : function(socket){
		socket.room = this.name;
		socket.join(this.name);
		this.status++;
		console.log(socket.playerName + " join to room"+this.name);
		if(this.status === GameVars.roomStatus.FULL){
			this.startNewGame();
		}

		
	},
	leaveRoom : function(socket){
		this.status--;
	},
	startNewGame : function(){
		this.game.createNewTable();
		this.io.sockets.in(this.name).emit(GameVars.command.STARTGAME,this.game.table);
	}
	
});


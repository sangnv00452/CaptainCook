(function(){
	var Client = function(){
		
	};
	Client.prototype.connect = function(){
		var socket = io.connect("http://localhost:8080");
	
		socket.on("connect",function(){
			socket.emit("newPlayer",prompt("What's your name?"));
			
		});
	
		socket.on("disconnect", function(){
			
		});
		socket.on(GameVars.command.STARTGAME,function(data){
			console.log(data);
		});
		
	}
})();


window.onload = function(){
		var socket = io.connect("http://localhost:8080");
	
		socket.on("connect",function(){
			socket.emit("newPlayer",prompt("What's your name?"));
			
		});
	
		socket.on("disconnect", function(){
			
		});
		socket.on(GameVars.command.STARTGAME,function(data){
			    var board = new NS.Board();
			    board.drawTable();
			    stage.addChild(board);
			    stage.update();
			    createjs.Ticker.addListener(stage);
			
		});
};


var image;
var stage;
var canvas;
window.onload = function () {
    NS.images = {};
    //canvas = document.getElementById("game");
    stage = new createjs.Stage("game");

    var manifest = [
        { id: "sprite", src: "images/sprite.png" },
        { id: "blue", src: "images/blue.png" },
        { id: "yellow", src: "images/yellow.png" }
    ];
    var loader = new createjs.PreloadJS(false);
    loader.onProgress = handleProgress;
    loader.onFileLoad = handleFileLoad;
    loader.onComplete = handleComplete;
    loader.loadManifest(manifest);
    createjs.Ticker.setFPS(60);
};

handleProgress = function (event) {

};

handleFileLoad = function (event) {
    NS.images[event.id] = event.result;
};

handleComplete = function (event) {
			var socket = io.connect("http://localhost:8080");
	
		socket.on("connect",function(){
			socket.emit("newPlayer",prompt("What's your name?"));
			
		});
	
		socket.on("disconnect", function(){
			
		});
		socket.on(GameVars.command.STARTGAME,function(data){
			    var board = new NS.Board(canvas,data);
			    board.drawTable();
			    stage.addChild(board);
			    stage.update();
			    createjs.Ticker.addListener(stage);
			
		});
   /*
    var board = new NS.Board();
       board.drawTable();
       stage.addChild(board);
       stage.update();
       createjs.Ticker.addListener(stage);*/
   

};
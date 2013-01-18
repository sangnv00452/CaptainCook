(function(){
	var ClientBroad = function(){

		
        this.spriteSheet = new createjs.SpriteSheet({
            images: [NS.images["sprite"]],
            frames: { width: 50, height: 50 }
        });

        this.hitArea = new createjs.Shape();
        this.hitArea.graphics.beginFill("#ccc").drawRect(0, 0, 50, 50);
        this.initialize();
        this.map = new NS.Map();

        this.addChild(this.map);

        this.selectedPiece = new createjs.Shape();
        this.selectedPiece.graphics.beginStroke("#000");
        this.selectedPiece.graphics.setStrokeStyle(1);
        this.selectedPiece.graphics.drawRect(1, 1, 49, 49);
        this.selectedPiece.visible = false;
        this.addChild(this.selectedPiece);
	};
    ClientBroad.prototype = new createjs.Container();

    ClientBroad.prototype._initialize = Board.prototype.initialize;
    ClientBroad.prototype.hitArea = null;
    ClientBroad.prototype.map = null;

    ClientBroad.prototype.canvas = null;
    ClientBroad.prototype.ctx = null;
    ClientBroad.prototype.spriteSheet = null;
    ClientBroad.prototype.table = null;
    ClientBroad.prototype.firstPiece = null;

    ClientBroad.prototype.isFalling = false;
    ClientBroad.prototype.isMyTurn = false;

    ClientBroad.prototype.myScore = 0;
    ClientBroad.prototype.rivalScore = 0;

/*
    ClientBroad.prototype.ROW = 8;
    ClientBroad.prototype.COLUMN = 8;
    ClientBroad.prototype.SWAP_NONE = 0;
    ClientBroad.prototype.SWAP_TRUE = 1;
    ClientBroad.prototype.SWAP_FALSE = 2;*/

    ClientBroad.prototype.SPEED = 200;
	
    // initialize game   
    ClientBroad.prototype.initialize = function () {
        this._initialize();

        this.isFalling = false;
        this.isSwapping = GameVars.swapStatus.NONE;
        this.isMyTurn = true;
        this.table = new Array();
        for (var i = 0; i < GameVars.ROW; i++) {
            this.table[i] = new Array();
        }
        //this.createNewTable();
        //this.collectAllMatchPiece();
        //console.log(this.assumeSwapPiece());
    };
    
    ClientBroad.prototype.createNewTable = function(){
    	
    };
    ClientBroad.prototype.createPiece = function(row,column,data){
    	var me = this;
        //var type = (Math.random() * 6) >> 0;
        var newPiece = new NS.Piece(this.spriteSheet, row, column, data.type);
        newPiece.hitArea = this.hitArea;
        /*
        newPiece.onPress = function (evt) {
                    var piece = evt.target;
        
                    if (me.firstPiece == null) {
                        me.firstPiece = piece;
                        me.selectedPiece.visible = true;
                        me.selectedPiece.x = me.firstPiece.x;
                        me.selectedPiece.y = me.firstPiece.y;
        
                    } else if (me.firstPiece == piece) {
                        me.firstPiece = null;
                        me.selectedPiece.visible = false;
        
                    } else {
                        // same row
                        me.selectedPiece.visible = false;
                        if (me.firstPiece.row == piece.row) {
                            if (Math.abs(me.firstPiece.column - piece.column) == 1) {
                                //me.swapPieceAnimation(me.firstPiece, piece);
                                me.firstPiece = null;
                            } else {
                                me.firstPiece = null;
                            }
                        // same column
                        } else if (me.firstPiece.column == piece.column) {
                            if (Math.abs(me.firstPiece.row - piece.row) == 1) {
                                //me.swapPieceAnimation(me.firstPiece, piece);
                                me.firstPiece = null;
                            } else {
                                me.firstPiece = null;
                            }
                        } else {
                            me.firstPiece = null;
                        }
                    }
                };*/
        
        this.table[row][column] = newPiece;
        this.addChild(newPiece);
        return newPiece;
    };
    
    // swap 2 Piece
    ClientBroad.prototype.swapPiece = function (piece1, piece2) {
        var termRow = piece1.row;
        var termColumn = piece1.column;

        piece1.row = piece2.row;
        piece1.column = piece2.column;
        piece2.row = termRow;
        piece2.column = termColumn;

        this.table[piece1.row][piece1.column] = piece1;
        this.table[piece2.row][piece2.column] = piece2;
    };
})(NS);
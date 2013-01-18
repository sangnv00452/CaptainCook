(function (NS) {
    var Board = function (canvas,data) {

        //this.canvas = canvas;
        //this.ctx = canvas.getContext('2d');
		//this.table = data;
		this.data = data;
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

    Board.prototype = new createjs.Container();

    Board.prototype._initialize = Board.prototype.initialize;
    Board.prototype.hitArea = null;
    Board.prototype.map = null;

    Board.prototype.canvas = null;
    Board.prototype.ctx = null;
    Board.prototype.spriteSheet = null;
    Board.prototype.table = null;
    Board.prototype.firstPiece = null;

    Board.prototype.isFalling = false;
    Board.prototype.isMyTurn = false;

    Board.prototype.myScore = 0;
    Board.prototype.rivalScore = 0;

    Board.prototype.ROW = 8;
    Board.prototype.COLUMN = 8;
    Board.prototype.SWAP_NONE = 0;
    Board.prototype.SWAP_TRUE = 1;
    Board.prototype.SWAP_FALSE = 2;
    Board.prototype.SPEED = 200;  // pixcel per frame
    Board.prototype.MY_COLOR = "#41BF7E";
    Board.prototype.RIVAl_COLOR = "#699332";

    // initialize game   
    Board.prototype.initialize = function () {
        this._initialize();

        this.isFalling = false;
        this.isSwapping = this.SWAP_NONE;
        this.isMyTurn = true;
        this.table = new Array();
        for (var i = 0; i < this.ROW; i++) {
           this.table[i] = new Array();
        }
		this.convertData(this.data);
        //this.createNewTable();
        //this.collectAllMatchPiece();
        //console.log(this.assumeSwapPiece());
    };
	Board.prototype.convertData = function(data){
		for(var i=0;i<8;i++){
			for(var j =0;j<8;j++){
				var obj = data[i][j]
				        var me = this;
        //var type = (Math.random() * 6) >> 0;
        var newPiece = new NS.Piece(this.spriteSheet, obj.row, obj.column, obj.type);
        newPiece.hitArea = this.hitArea;
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
                        me.swapPieceAnimation(me.firstPiece, piece);
                        me.firstPiece = null;
                    } else {
                        me.firstPiece = null;
                    }
                    // same column
                } else if (me.firstPiece.column == piece.column) {
                    if (Math.abs(me.firstPiece.row - piece.row) == 1) {
                        me.swapPieceAnimation(me.firstPiece, piece);
                        me.firstPiece = null;
                    } else {
                        me.firstPiece = null;
                    }
                } else {
                    me.firstPiece = null;
                    console.log(me.firstPiece);
                }
            }
        };
        this.table[i][j] = newPiece;
        this.addChild(newPiece);
       // return newPiece;
			}
		}
	};
    Board.prototype.drawTable = function () {
        var currentPiece;
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COLUMN; j++) {
                currentPiece = this.table[i][j];
                currentPiece.x = currentPiece.column * 50;
                currentPiece.y = currentPiece.row * 50;
                this.addChild(currentPiece);
            }
        }
        //console.log(this.table);
    };

    // create new table
    Board.prototype.createNewTable = function () {
        var i, j;
        // fill piece into Table
        do {
            for (i = 0; i < this.ROW; i++) {
                for (j = 0; j < this.COLUMN; j++) {
                    this.createPiece(i, j);
                }
            }
        } while (!this.findAllPossibles().length)

        // fill all Match piece and split them
        var listMatchPiece = this.findAllMatchPiece();
        if (listMatchPiece.length) {
            for (i = 0; i < listMatchPiece.length; i++) {
                var listPiece = listMatchPiece[i];
                this.changeMidPieceType(listPiece);
            }
        }
    };

    // prevent match Piece by change type of mid Piece in Match Piece list
    Board.prototype.changeMidPieceType = function (listPiece) {
        var corner = (listPiece.length / 2) >> 0;
        if (listPiece.length > 5) {
            this.changeMidPieceType(listPiece.slice(0, corner));
            this.changeMidPieceType(listPiece.slice(corner, -1));
        } else {
            var piece = listPiece[corner];
            do {
                var type = this.table[piece.row][piece.column].type;
                type = (type + 1) > 5 ? 0 : type + 1;
                this.table[piece.row][piece.column].changeType(type);
            } while (this.findSpreadPiece(piece.row, piece.column).matchList.length > 0)
        }
    };

    // remove all Match Piece
    Board.prototype.collectAllMatchPiece = function () {
        var numPiece = 0;
        var list = this.findAllMatchPiece();
        for (var i = 0; i < list.length; i++) {
            var pieceList = list[i];
            for (var j = 0; j < pieceList.length; j++) {
                var piece = pieceList[j];
                if (this.getChildIndex(piece) != -1) {
                    numPiece++;
                    //console.log(numPiece);
                    this.drawTerritory(piece, this.isMyTurn);
                    this.removeChild(piece);
                    this.table[piece.row][piece.column] = null;
                    this.fallPiece(piece);
                }
            }
        }
        this.addNewPiece();
        if (list.length == 0) {
            console.log(this.map.myScore + " vs " + this.map.rivalSore);

            this.isMyTurn = this.isMyTurn ? false : true;
            this.enableClick(this.isMyTurn);
            if (!this.isMyTurn) {
                var listP = this.assumeSwapPiece();
                var lastPair = listP[listP.length - 1];
                this.swapPieceAnimation(lastPair.piece1, lastPair.piece2);
            }
            if (!this.findAllPossibles().length) {
                console.log("gameOver");
            }
        }

    };

    // draw territory
    Board.prototype.drawTerritory = function (piece, isMyTurn) {
        this.map.fillTerritory(piece.row, piece.column, isMyTurn);
    };

    // find all match Piece
    Board.prototype.findAllMatchPiece = function () {
        var matchList = new Array();
        var i, j, match;

        // find in horizontal
        for (i = 0; i < this.ROW; i++) {
            for (j = 0; j < this.COLUMN - 2; j++) {
                match = this.findMatchHori(i, j);
                if (match.length > 2) {
                    matchList.push(match);
                    j += match.length - 1;
                }
            }
        }

        // find in vertical
        for (j = 0; j < this.COLUMN; j++) {
            for (i = 0; i < this.ROW - 2; i++) {
                match = this.findMatchVert(i, j);
                if (match.length > 2) {
                    matchList.push(match);
                    i += match.length - 1;
                }
            }
        }
        return matchList;
    };

    // find all adjacent piece in horizontal that have same type starting at this point
    Board.prototype.findMatchHori = function (row, column) {
        var currentPosition = this.table[row][column];
        var rightPosition;
        var listPieces = new Array(currentPosition);
        for (var i = 1; column + i < this.COLUMN; i++) {
            rightPosition = this.table[row][column + i];
            if (currentPosition.type == rightPosition.type) {
                listPieces.push(rightPosition);
            } else {
                return listPieces;
            }
        }
        return listPieces;
    };

    // find all adjacent piece in vertical that have same type starting at this point
    Board.prototype.findMatchVert = function (row, column) {
        var currentPosition = this.table[row][column];
        var downPosition;
        var listPieces = new Array(currentPosition);
        for (var i = 1; row + i < this.ROW; i++) {
            downPosition = this.table[row + i][column];
            if (currentPosition.type == downPosition.type) {
                listPieces.push(downPosition);
            } else {
                return listPieces;
            }
        }

        return listPieces;
    };

    // find Match Piece starting at current Piece
    Board.prototype.findSpreadPiece = function (row, column) {
        var currentType = this.table[row][column].type;
        var horiList = new Array(this.table[row][column]);
        var vertList = new Array(this.table[row][column]);
        var matchList = new Array();

        // check horizontal
        if (this.isMatchType(row, column + 1, currentType)) {
            horiList.push(this.table[row][column + 1]);
            if (this.isMatchType(row, column + 2, currentType)) {
                horiList.push(this.table[row][column + 2]);
            }
        }
        if (this.isMatchType(row, column - 1, currentType)) {
            horiList.push(this.table[row][column - 1]);
            if (this.isMatchType(row, column - 2, currentType)) {
                horiList.push(this.table[row][column - 2]);
            }
        }
        if (horiList.length > 2) {
            matchList.push(horiList);
        } else {
            horiList.length = 0;
        }

        // check vertical
        if (this.isMatchType(row + 1, column, currentType)) {
            vertList.push(this.table[row + 1][column]);
            if (this.isMatchType(row + 2, column, currentType)) {
                vertList.push(this.table[row + 2][column]);
            }
        }
        if (this.isMatchType(row - 1, column, currentType)) {
            vertList.push(this.table[row - 1][column]);
            if (this.isMatchType(row - 2, column, currentType)) {
                vertList.push(this.table[row - 2][column]);
            }
        }
        if (vertList.length > 2) {
            matchList.push(vertList);
        } else {
            vertList.length = 0;
        }
        var sum = (horiList.length + vertList.length) > 5 ? horiList.length + vertList.length - 1 : horiList.length + vertList.length;
        return {
            matchList: matchList,
            numPiece: sum
        };
    };

    // move down piece
    Board.prototype.fallPiece = function (piece) {
        for (var i = piece.row - 1; i >= 0; i--) {
            if (this.table[i][piece.column] != null) {
                this.table[i][piece.column].row++;
                this.table[i + 1][piece.column] = this.table[i][piece.column];
                this.table[i][piece.column] = null;
            }
        }
    };

    // swap 2 Piece
    Board.prototype.swapPiece = function (piece1, piece2) {
        var termRow = piece1.row;
        var termColumn = piece1.column;

        piece1.row = piece2.row;
        piece1.column = piece2.column;
        piece2.row = termRow;
        piece2.column = termColumn;

        this.table[piece1.row][piece1.column] = piece1;
        this.table[piece2.row][piece2.column] = piece2;

    };

    // make animation swap
    Board.prototype.swapPieceAnimation = function (piece1, piece2) {
        this.piece1 = piece1;
        this.piece2 = piece2;
        this.swapPiece(piece1, piece2);
        this.selectedPiece.visible = false;
        if (this.isSwapping == this.SWAP_FALSE) {
            this.isSwapping = this.SWAP_NONE;
            return;
        }
        if (!this.findSpreadPiece(piece1.row, piece1.column).numPiece && !this.findSpreadPiece(piece2.row, piece2.column).numPiece) {
            this.isSwapping = this.SWAP_FALSE;
        } else {
            this.isSwapping = this.SWAP_TRUE;

        }
    };

    // find all case can match
    Board.prototype.findAllPossibles = function () {
        var swappablePiece = new Array();
        var horiLeftList, horiRightList, horiMidList;
        var vertTopList, vertBotList, vertMidList;
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COLUMN; j++) {
                // horizontal and swap piece is left side
                horiLeftList = this.hasMatch(i, j, [0, 1], [[0, -2], [-1, -1], [1, -1]], [0, -1]);

                if (horiLeftList.length) {
                    swappablePiece = swappablePiece.concat(horiLeftList);
                }

                // horizontal and swap piece is right side
                horiRightList = this.hasMatch(i, j, [0, 1], [[-1, 2], [0, 3], [-1, 2]], [0, 2]);

                if (horiRightList.length) {
                    swappablePiece = swappablePiece.concat(horiRightList);
                }

                // horizontal and swap piece is midle
                horiMidList = this.hasMatch(i, j, [0, 2], [[-1, 1], [1, 1]], [0, 1]);

                if (horiMidList.length) {
                    swappablePiece = swappablePiece.concat(horiMidList);
                }

                // vertical and swap piece is top side
                vertTopList = this.hasMatch(i, j, [1, 0], [[-2, 0], [-1, -1], [-1, 1]], [-1, 0]);

                if (vertTopList.length) {
                    swappablePiece = swappablePiece.concat(vertTopList);
                }

                // vertical and swap piece is top side
                vertBotList = this.hasMatch(i, j, [1, 0], [[2, -1], [2, 1], [3, 0]], [2, 0]);

                if (vertBotList.length) {
                    swappablePiece = swappablePiece.concat(vertBotList);
                }

                // vertical and swap piece is midle
                vertMidList = this.hasMatch(i, j, [2, 0], [[1, -1], [1, 1]], [1, 0]);

                if (vertMidList.length) {
                    swappablePiece = swappablePiece.concat(vertMidList);
                }
            }
        }
        //console.log(swappablePiece);
        return swappablePiece;
    };

    // check current position 
    Board.prototype.hasMatch = function (row, column, brother, missingBrothers, swapPiece) {
        var swappablePieces = new Array();

        if (this.table[row][column] == null) return swappablePieces;
        var type = this.table[row][column].type;
        var i;
        // check valid swapPiece;
        if (!this.isValid(row + swapPiece[0], column + swapPiece[1]))
            return swappablePieces;

        var piece = this.table[row + swapPiece[0]][column + swapPiece[1]];
        var list;

        // check brother list, return false if it has not same type with current Piece
        if (!this.isMatchType(row + brother[0], column + brother[1], type)) {
            return swappablePieces;
        }

        // check missing brother, return true if at least one of them has same type with current Piece
        for (i = 0; i < missingBrothers.length; i++) {
            if (this.isMatchType(row + missingBrothers[i][0], column + missingBrothers[i][1], type)) {
                list = new Array(piece);
                list.push(this.table[row + missingBrothers[i][0]][column + missingBrothers[i][1]]);
                swappablePieces.push(list);
            }
        }

        return swappablePieces;
    };

    // Assuming swap Piece and calculate Piece Number
    Board.prototype.assumeSwapPiece = function () {
        var swappableList = this.findAllPossibles();
        var piece1, piece2, obj;
        var list = new Array();
        for (var i = 0; i < swappableList.length; i++) {
            obj = new Object();

            piece1 = swappableList[i][0];
            piece2 = swappableList[i][1];
            obj.piece1 = piece1;
            obj.piece2 = piece2;

            this.swapPieceType(piece1.row, piece1.column, piece2.row, piece2.column);

            obj.numPiece = this.findSpreadPiece(piece1.row, piece1.column).numPiece + this.findSpreadPiece(piece2.row, piece2.column).numPiece;

            list.push(obj);
            this.swapPieceType(piece1.row, piece1.column, piece2.row, piece2.column);
        }
        list.sort(function (a, b) {
            return a.numPiece - b.numPiece;
        });

        return list;
    };

    // swap type of 2 Piece in table
    Board.prototype.swapPieceType = function (row1, column1, row2, column2) {
        var term = this.table[row1][column1].type;
        this.table[row1][column1].changeType(this.table[row2][column2].type);
        this.table[row2][column2].changeType(term);
    };

    // check type
    Board.prototype.isMatchType = function (row, column, type) {
        if (row < 0 || row > 7 || column < 0 || column > 7) return false;
        if (!this.table[row][column]) return false;
        return (this.table[row][column].type == type);
    };

    // Check valid position
    Board.prototype.isValid = function (row, column) {
        if (row < 0 || row > 7 || column < 0 || column > 7) return false;
        if (!this.table[row][column]) return false;
        return true;

    };

    // add new piece
    Board.prototype.addNewPiece = function () {
        var piece, emptyNum;
        for (var j = 0; j < this.COLUMN; j++) {
            emptyNum = 0;
            for (var i = this.ROW - 1; i >= 0; i--) {
                if (this.table[i][j] == null) {
                    piece = this.createPiece(i, j);
                    piece.y = (-50 * emptyNum) - 50;
                    piece.x = 50 * j;
                    emptyNum++;
                    this.isFalling = true;
                }
            }
        }
    };
	
    // create new Piece
    Board.prototype.createPiece = function (row, column) {
        var me = this;
        var type = (Math.random() * 6) >> 0;
        var newPiece = new NS.Piece(this.spriteSheet, row, column, type);
        newPiece.hitArea = this.hitArea;
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
                        me.swapPieceAnimation(me.firstPiece, piece);
                        me.firstPiece = null;
                    } else {
                        me.firstPiece = null;
                    }
                    // same column
                } else if (me.firstPiece.column == piece.column) {
                    if (Math.abs(me.firstPiece.row - piece.row) == 1) {
                        me.swapPieceAnimation(me.firstPiece, piece);
                        me.firstPiece = null;
                    } else {
                        me.firstPiece = null;
                    }
                } else {
                    me.firstPiece = null;
                    console.log(me.firstPiece);
                }
            }
        };
        this.table[row][column] = newPiece;
        this.addChild(newPiece);
        return newPiece;
    };

    // on tick
    Board.prototype.onTick = function (lastTime) {
        var onRoad = false;
        var currentPiece;
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COLUMN; j++) {
                currentPiece = this.table[i][j];
                if (currentPiece) {
                    // move down
                    if (currentPiece.y < currentPiece.row * 50) {
                        currentPiece.y += (this.SPEED * (lastTime / 1000)) >> 0;
                        if (currentPiece.y > currentPiece.row * 50) {
                            currentPiece.y = currentPiece.row * 50;
                        }
                        onRoad = true;
                    }

                    // move up
                    if (currentPiece.y > currentPiece.row * 50) {
                        currentPiece.y -= (this.SPEED * (lastTime / 1000)) >> 0;
                        if (currentPiece.y < currentPiece.row * 50) {
                            currentPiece.y = currentPiece.row * 50;
                        }
                        onRoad = true;
                    }

                    // move left
                    if (currentPiece.x > currentPiece.column * 50) {
                        currentPiece.x -= (this.SPEED * (lastTime / 1000)) >> 0;
                        if (currentPiece.x < currentPiece.column * 50) {
                            currentPiece.x = currentPiece.column * 50;
                        }
                        onRoad = true;
                    }

                    // move right
                    if (currentPiece.x < currentPiece.column * 50) {
                        currentPiece.x += (this.SPEED * (lastTime / 1000)) >> 0;
                        if (currentPiece.x > currentPiece.column * 50) {
                            currentPiece.x = currentPiece.column * 50;
                        }
                        onRoad = true;
                    }
                }
            }
        }
        if (!onRoad && this.isFalling) {
            this.isFalling = false;
            this.collectAllMatchPiece();
        } else if (!onRoad && this.isSwapping == this.SWAP_TRUE) {
            this.isSwapping = this.SWAP_NONE;
            this.collectAllMatchPiece();
        } else if (!onRoad && this.isSwapping == this.SWAP_FALSE) {
            this.swapPieceAnimation(this.piece1, this.piece2);
        }
    };
    Board.prototype.enableClick = function (isEnable) {
        if (!isEnable) {
            this.mouseEnabled = false;
        } else {
            this.mouseEnabled = true;
        }
    };

    NS.Board = Board;
})(NS);
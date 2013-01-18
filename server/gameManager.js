var GameVars = require("../js/gameVars");

(function(){
	var GameManager = function (){
		this.initialize();
	};
	
	GameManager.prototype.table = null;
	
	GameManager.prototype.initialize = function(){
		this.table = [];
		for(var i = 0;i < GameVars.ROW;i++){
			this.table[i] = [];
		}
	};
	
    // create new table
    GameManager.prototype.createNewTable = function () {
        var i, j;
        // fill piece into Table
        do {
            for (i = 0; i < GameVars.ROW; i++) {
                for (j = 0; j < GameVars.COLUMN; j++) {
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
    GameManager.prototype.createPiece = function(row,column){
    	var type = (Math.random()*6)>>0;
    	var newPiece = new Object;
    	newPiece.type = type;
    	newPiece.row = row;
    	newPiece.column = column;
    	this.table[row][column] = newPiece;
    };
    
    // find all case can match
    GameManager.prototype.findAllPossibles = function () {
        var swappablePiece = new Array();
        var horiLeftList, horiRightList, horiMidList;
        var vertTopList, vertBotList, vertMidList;
        for (var i = 0; i < GameVars.ROW; i++) {
            for (var j = 0; j < GameVars.COLUMN; j++) {
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
    GameManager.prototype.hasMatch = function (row, column, brother, missingBrothers, swapPiece) {
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
	
    // check type
    GameManager.prototype.isMatchType = function (row, column, type) {
        if (row < 0 || row > 7 || column < 0 || column > 7) return false;
        if (!this.table[row][column]) return false;
        return (this.table[row][column].type == type);
    };
	
	// find all match Piece
    GameManager.prototype.findAllMatchPiece = function () {
        var matchList = new Array();
        var i, j, match;

        // find in horizontal
        for (i = 0; i < GameVars.ROW; i++) {
            for (j = 0; j < GameVars.COLUMN - 2; j++) {
                match = this.findMatchHori(i, j);
                if (match.length > 2) {
                    matchList.push(match);
                    j += match.length - 1;
                }
            }
        }

        // find in vertical
        for (j = 0; j < GameVars.COLUMN; j++) {
            for (i = 0; i < GameVars.ROW - 2; i++) {
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
    GameManager.prototype.findMatchHori = function (row, column) {
        var currentPosition = this.table[row][column];
        var rightPosition;
        var listPieces = new Array(currentPosition);
        for (var i = 1; column + i < GameVars.COLUMN; i++) {
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
    GameManager.prototype.findMatchVert = function (row, column) {
        var currentPosition = this.table[row][column];
        var downPosition;
        var listPieces = new Array(currentPosition);
        for (var i = 1; row + i < GameVars.ROW; i++) {
            downPosition = this.table[row + i][column];
            if (currentPosition.type == downPosition.type) {
                listPieces.push(downPosition);
            } else {
                return listPieces;
            }
        }

        return listPieces;
    };
	
    // prevent match Piece by change type of mid Piece in Match Piece list
    GameManager.prototype.changeMidPieceType = function (listPiece) {
        var corner = (listPiece.length / 2) >> 0;
        if (listPiece.length > 5) {
            this.changeMidPieceType(listPiece.slice(0, corner));
            this.changeMidPieceType(listPiece.slice(corner, -1));
        } else {
            var piece = listPiece[corner];
            do {
                var type = this.table[piece.row][piece.column].type;
                type = (type + 1) > 5 ? 0 : type + 1;
                this.table[piece.row][piece.column].type = type;
            } while (this.findSpreadPiece(piece.row, piece.column).matchList.length > 0)
        }
    };
	
	// find Match Piece starting at current Piece
    GameManager.prototype.findSpreadPiece = function (row, column) {
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
	
	    // Check valid position
    GameManager.prototype.isValid = function (row, column) {
        if (row < 0 || row > 7 || column < 0 || column > 7) return false;
        if (!this.table[row][column]) return false;
        return true;

    };
	module.exports = GameManager;
})();

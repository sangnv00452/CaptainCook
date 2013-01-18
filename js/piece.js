(function (NS) {
    var Piece = function (spriteSheet, row, column, type) {
        this.initialize(spriteSheet);
        this.row = row;
        this.column = column;
        this.type = type;
        this.gotoAndStop(type);
    };
    Piece.prototype = new createjs.BitmapAnimation();
    Piece.prototype._initialize = Piece.prototype.initialize;
    Piece.prototype.x = 0;
    Piece.prototype.y = 0;
    Piece.prototype.row = -1;
    Piece.prototype.column = -1;
    Piece.prototype.type = -1;
    Piece.prototype.initialize = function (spriteSheet) {
        this._initialize(spriteSheet);
    };
    Piece.prototype.changeType = function(newType) {
        this.type = newType;
        this.gotoAndStop(newType);
    };

    NS.Piece = Piece;
})(NS)
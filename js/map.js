(function (NS) {
    var Map = function () {
        this.initialize();
    };
    Map.prototype = new createjs.Container();
    Map.prototype._initialize = Map.prototype.initialize;

    Map.prototype.territory = null;
    Map.prototype.myScore = 0;
    Map.prototype.rivalSore = 0;
    Map.prototype.initialize = function () {
        this._initialize();
        this.mouseEnabled = false;
        this.territory = new Array();
        for (var i = 0; i < 8; i++) {
            this.territory[i] = new Array();
        }
    };

    Map.prototype.fillTerritory = function (row, colum, isMyTerritory) {
        var currentArea = this.territory[row][colum];
        var mark;
        if (currentArea) {
            if (currentArea.isMyTerritory == isMyTerritory) {
                return;
            } else {
                this.removeChild(currentArea);
                mark = new NS.Mark(isMyTerritory);
                mark.x = colum * 50;
                mark.y = row * 50;
                this.territory[row][colum] = mark;
                this.addChild(mark);

                if (isMyTerritory) {
                    this.myScore++;
                    this.rivalSore--;
                } else {
                    this.myScore--;
                    this.rivalSore++;
                }

            }
        } else {
            mark = new NS.Mark(isMyTerritory);
            mark.x = colum * 50;
            mark.y = row * 50;
            this.territory[row][colum] = mark;
            this.addChild(mark);

            if (isMyTerritory) {
                this.myScore++;
            } else {
                this.rivalSore++;
            }
        }
    };

    NS.Map = Map;
})(NS)
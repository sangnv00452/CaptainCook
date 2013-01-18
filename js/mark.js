(function (NS) {
    var Mark = function (isMyTerritory) {
        this.initialize(isMyTerritory);
    };

    Mark.prototype = new createjs.Bitmap();
    Mark.prototype._initialize = Mark.prototype.initialize;

    Mark.prototype.initialize = function (isMyTerritory) {
        this.isMyTerritory = isMyTerritory;
        if (isMyTerritory) {
            this._initialize(NS.images["blue"]);
        } else {
            this._initialize(NS.images["yellow"]);
        }
        this.mouseEnabled = false;
    };
    NS.Mark = Mark;
})(NS);
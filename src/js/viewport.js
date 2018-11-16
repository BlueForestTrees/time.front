(function() {
    function Viewport(_scale) {
        this._local = 0;
        this._zoom = 1;
        this._scale = _scale;
    }

    Viewport.prototype.delta = function() {
        return Math.round(this._local);
    };

    Viewport.prototype.toCanvasX = function (bucketX) {
        // y = ax + b
        return this._zoom * bucketX + this.delta();
    };

    Viewport.prototype.toBucketX = function (canvasX) {
        // x = ( y - b ) / a
        return Math.round(this.toBucketFloatX(canvasX));
    };

    Viewport.prototype.toBucketFloatX = function (canvasX){
        return (canvasX - this.delta()) / this._zoom;
    };

    Viewport.prototype.normalize = function (x1, x2, y1, y2){
        //on évalue a
        this._zoom = (y2 - y1) / (x2 - x1);
        //qu'on réutilise pour avoir b
        this._local = y1 - this._zoom*x1;
    };

    Time.Viewport = Viewport;
})();
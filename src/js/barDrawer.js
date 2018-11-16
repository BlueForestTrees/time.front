(function() {
    function BarDrawer() {
        this.fillLevel = 251;
    }

    BarDrawer.prototype.install = function() {
        this._hideBar();
        this._updateSizeBar();
        $(window).on('resize', this._updateSizeBar);
        delete BarDrawer.prototype.install;
    };

    BarDrawer.prototype.drawBar = function(bar, explicitBuckets) {
        bar.normalize();
        var buckets = explicitBuckets ? explicitBuckets : bar.buckets;
        bar.context.fillStyle = 'rgb('+this.fillLevel+','+this.fillLevel+','+this.fillLevel+')';
        bar.context.fillRect(0, 0, bar.canvas.width, bar.canvas.height);

        buckets.forEach(function(bucket){
            bar.context.fillStyle = bucket.color;
            bar.context.fillRect(bar.viewport.toCanvasX(bucket.x), 0, 1, bar.canvas.height);
        });
    };

    BarDrawer.prototype.focusOn = function(bar) {
        this._unreduceBar(bar);
    };

    BarDrawer.prototype._hideBar = function(){
        $(Time.bar.canvas).hide();
    };

    BarDrawer.prototype._updateSizeBar = function() {
        Time.barDrawer.drawBar(Time.bar);
        Time.tooltips.updateTooltips();
    };

    BarDrawer.prototype._reduceBar = function(bar){
        if(!bar.reduced){
            bar.reduced = true;

            $(bar.canvas).attr({
                height : bar.reducedHeight
            });

            $(bar.canvas).css({
                opacity : bar.reducedOpacity
            });

            this.drawBar(bar);
            bar.focusOnEnter();
        }
    };

    BarDrawer.prototype._unreduceBar = function(bar) {
        bar.reduced = false;
        $(bar.canvas).attr({
            height : bar.height
        });
        $(bar.canvas).css({
            opacity : 1
        });
        $(bar.canvas).show();
        this.drawBar(bar);
    };

    Time.BarDrawer = BarDrawer;
})();
(function() {
    function Tooltips() {
        this.currentBar = null;
    }

    // SUR LA BARRE CONTENANT LA SOURIS
    Tooltips.prototype.mouseMoveOnBar = function(event) {
        Time.tooltips.updateTooltips(null, event.clientX);
    };

    // DESSOUS DE LA BARRE ACTIVE
    Tooltips.prototype.decorate = function(bar) {
        if (this.currentBar) {
            this.undecorate(this.currentBar);
        }
        if(bar){
            this.currentBar = bar;

            $(bar.canvas).on('mousemove.Tooltip', bar, this.mouseMoveOnBar);
            $(bar.canvas).on('mouseout.Tooltip', bar, this.mouseOutOnBar);

            this.updateTooltips();
        }
    };
    
    Tooltips.prototype.mouseOutOnBar = function (){
        Time.tooltips.updateTooltips();
    };

    Tooltips.prototype.undecorate = function(bar) {
        $(bar.canvas).off('mousemove.Tooltip');
        $(bar.canvas).off('mouseout.Tooltip');
        this.hideTooltips();
    };

    Tooltips.prototype.updateTooltips = function(animate, mouseX) {
        if(!Time.tooltips.currentBar){
            return;
        }

        if(Time.tooltips.currentBar.monoBucket()){
            Time.tooltips.toolTipAt(Time.view.activeBarTips[1], Time.tooltips.currentBar.middle(), animate);
        }else{
            var tooltipsXs = [];
            tooltipsXs[0] = Time.tooltips.currentBar.aLeftBucket();
            tooltipsXs[2] = Time.tooltips.currentBar.aRightBucket();
            tooltipsXs[1] = 0.5 * (tooltipsXs[0]+tooltipsXs[2]);

            if(mouseX){
                tooltipsXs[Time.tooltips.getNearest(mouseX, tooltipsXs)] = mouseX;
            }

            Time.tooltips.toolTipAt(Time.view.activeBarTips[0], tooltipsXs[0], animate);
            Time.tooltips.toolTipAt(Time.view.activeBarTips[1], tooltipsXs[1], animate);
            Time.tooltips.toolTipAt(Time.view.activeBarTips[2], tooltipsXs[2], animate);
        }
    };

    Tooltips.prototype.getNearest = function(mouseX, xS){
        return xS.map(function(x){return Math.abs(mouseX - x);}).reduce(function(nearest, current, index){
            if(current < nearest.distance){
                return {distance:current, index:index};
            }else{
                return nearest;
            }
        },{distance:1000000, index:null}).index;
    };
    
    Tooltips.prototype.showTooltips = function(){
        this.updateTooltips();
    };
    Tooltips.prototype.hideTooltips = function(){
        Time.view.activeBarTips.forEach(function(tooltip){
            tooltip.css({opacity:0});
        });
    };
    
    Tooltips.prototype.toolTipAt = function(tooltip, tooltipX, animate) {
        var humanDate = Time.scale.bucketToHuman({
            scale : Time.tooltips.currentBar.scale,
            x : Time.tooltips.currentBar.viewport.toBucketX(tooltipX)
        });
        var toolTipTop = $(Time.tooltips.currentBar.canvas).position().top + Time.tooltips.currentBar.height + 7;
        // 22 => position à l'arrache pour que la flèche du tooltip coincide avec la souris.
        var toolTipLeft = tooltipX - 22;
        var width = ((humanDate.length + 1) * 8) + 'px';

        tooltip.text(humanDate);
        
        var css = {
                top : toolTipTop,
                width : width,
                opacity : 1
            };
        if(animate){            
            tooltip.animate({left : toolTipLeft}, 200);
        }else{
            css.left = toolTipLeft;
        }
        tooltip.css(css);
    };

    Time.Tooltip = Tooltips;
})();
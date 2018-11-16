(function () {
    function Bar() {
        this.height = 35;
        this.reducedHeight = 15;
        this.reducedOpacity = 0.25;
        this.reduced = false;
        this.scale = Time.scale.defaultScale();
        this.viewport = new Time.Viewport(this.scale);
        this.buckets = [];
        this.context = Time.barFactory.buildCanvas(this.height, this.scale);
        this.canvas = this.context.canvas;
        this.loading = false;
        this.bucketLeftRatio = 0.1;
        this.bucketRightRatio = 0.9;

        this.installEvents = function () {
            var data = {
                previousX: null,
                deltaX: null,
                move: false
            };
            $(this.canvas).on('mousedown.Viewport', data, $.proxy(this._mouseDownOnBar, this));
            delete this.installEvents;
        };
        this.installEvents();
    }

    Bar.prototype.monoBucket = function(){
        return this.buckets !== null && this.buckets.length === 1;
    };

    Bar.prototype.middle = function(){
        return this.canvas.width * 0.5;
    };

    Bar.prototype.aLeftBucket = function(){
        return this._searchRightOf(this._niceLeft());
    };

    Bar.prototype.aRightBucket = function(){
        return this._searchLeftOf(this._niceRight());
    };

    Bar.prototype.firstBucket = function(){
        return this.buckets[0];
    };
    Bar.prototype.lastBucket = function(){
        return this.buckets[this.buckets.length-1];
    };

    Bar.prototype.loadBuckets = function (term) {
        Time.barLoading.startLoading(this);
        Time.barDrawer.focusOn(this);
        Time.data.getBuckets(term, $.proxy(this._onBuckets, this));
        Time.tooltips.decorate(null);
    };

    Bar.prototype.focusOnEnter = function () {
        $(this.canvas).on('mouseenter.focusAtEnter', $.proxy(this._onEnter, this));
    };

    Bar.prototype.normalize = function(){
        var firstBucketX;
        var lastBucketX;
        var firstCanvasX;
        var lastCanvasX;
        if(this.buckets.length === 0) {
            //rien à normaliser
            firstBucketX = -1;
            lastBucketX = 1;
            firstCanvasX = 0.1 * this.canvas.width;
            lastCanvasX = 0.9 * this.canvas.width;
        }else if(this.buckets.length === 1) {
            //un seul bucket, il faut le mettre au centre.
            this.canvas.width = window.innerWidth;
            firstBucketX = this.firstBucket().x - 1;
            lastBucketX = this.firstBucket().x + 1;
            firstCanvasX = this._niceLeft();
            lastCanvasX = this._niceRight();
        }else if(this.buckets.length > 1){
            this.canvas.width = window.innerWidth;
            firstBucketX = this.firstBucket().x;
            lastBucketX = this.lastBucket().x;
            firstCanvasX = this._niceLeft();
            lastCanvasX = this._niceRight();
        }
        this.viewport.normalize(firstBucketX, lastBucketX, firstCanvasX, lastCanvasX);
    };


    Bar.prototype._niceLeft = function (){
        return this.bucketLeftRatio * this.canvas.width;
    };
    Bar.prototype._niceRight = function (){
        return this.bucketRightRatio * this.canvas.width;
    };
    /**
     * Cherche dans le canvas de la barre à droite de la position.
     * @param mouseX Où chercher dans la barre
     * @param amplitude la taille de la recherche, ou null pour chercher sur toute la longueur
     * @returns {*} Un mouseX le plus proche possible à droite ou undefined (pour ne pas être additionné à d'autres valeurs) si rien trouvé.
     */
    Bar.prototype._searchRightOf = function (mouseX, amplitude) {
        amplitude = amplitude || this.canvas.width - mouseX;
        var searchZone = this.context.getImageData(mouseX, 10, amplitude, 1).data;
        var found = undefined;
        for (var i = 0, j = 0; i < searchZone.length; i += 4) {
            if (this._bucketAt(searchZone, i)) {
                found = mouseX + j;
                break;
            }
            j++;
        }
        return found;
    };

    /**
     * Cherche dans le canvas de la barre à gauche de la position (exclu).
     * @param mouseX Où chercher dans la barre
     * @param amplitude la taille de la recherche, ou null pour chercher sur toute la longueur
     * @returns {*} Un mouseX le plus proche possible à droite ou undefined (pour ne pas être additionné à d'autres valeurs) si rien trouvé.
     */
    Bar.prototype._searchLeftOf = function (mouseX, amplitude) {
        amplitude = amplitude || mouseX;
        var searchZone = this.context.getImageData(mouseX - amplitude, 10, amplitude, 1).data;
        var found = undefined;
        //parcours de la searchZone en sens droite -> gauche
        for (var i = (amplitude - 1) * 4, j = 0; i >= 0; i -= 4) {
            if (this._bucketAt(searchZone, i)) {
                found = mouseX - j - 1;
                break;
            }
            j++;
        }
        return found;
    };

    /**
     * Indique si la position contient un bucket ou pas.
     * @param searchZone un tébleau résulant de getImageData
     * @param i la position où regarder
     * @returns {boolean} vrai si la position ne contient pas la couleur de fond de la barre.
     * @private
     */
    Bar.prototype._bucketAt = function (searchZone, i) {
        var fillLevel = Time.barDrawer.fillLevel;
        return searchZone[i] !== fillLevel || searchZone[i + 1] !== fillLevel || searchZone[i + 2] !== fillLevel;
    };

    /**
     * @param bucketX La position sur la barre du bucket à chercher.
     * @returns {*} Le premier bucket tel que {bucket.x === bucketX} ou null
     */
    Bar.prototype._getBucketAt = function (bucketX) {
        if (bucketX !== undefined && bucketX !== null) {
            for (var i = 0; i < this.buckets.length; i++) {
                var bucket = this.buckets[i];
                if (bucket.x === bucketX) {
                    return bucket;
                }
            }
        }
        return null;
    };

    Bar.prototype._onBuckets = function (bucketsDTO) {
        this.scale = bucketsDTO.scale;
        this.buckets = Time.barFactory.buildBuckets(bucketsDTO);
        Time.barLoading.stopLoading();
        Time.barDrawer.drawBar(this);
        Time.tooltips.decorate(this);
    };

    Bar.prototype._mouseDownOnBar = function (event) {
        event.data.downX = event.data.previousX = event.clientX;
        Time.view.window.on('mousemove.Viewport', event.data, $.proxy(this._onBarDrag, this));
        Time.view.window.on('mouseup.Viewport', event.data, $.proxy(this._onBarUp, this));
    };

    Bar.prototype._onBarDrag = function (event) {
        var increment = event.clientX - event.data.previousX;
        if (increment !== 0) {
            event.data.previousX = event.clientX;
            event.data.move = true;
        }
    };

    Bar.prototype._onBarUp = function (event) {
        if (event.data.move) {
            var minMouseX = Math.min(event.data.downX, event.clientX);
            var maxMouseX = Math.max(event.data.downX, event.clientX);
            var leftBucket = {scale:this.scale,x:this.viewport.toBucketFloatX(minMouseX)};
            var rightBucket = {scale:this.scale,x:this.viewport.toBucketFloatX(maxMouseX)};
            var leftFilter = Time.scale.bucketToFilter(leftBucket);
            var rightFilter = Time.scale.bucketToRightFilter(rightBucket);
            Time.filter.onPeriodFilter(leftFilter, rightFilter);
        }
        event.data.move = false;
        Time.view.window.off('mousemove.Viewport');
        Time.view.window.off('mouseup.Viewport');
    };

    Bar.prototype._onEnter = function () {
        Time.barDrawer.focusOn(this);
        Time.tooltips.decorate(this);
        $(this.canvas).off('mouseenter.focusAtEnter');
    };

    Time.Bar = Bar;
})();
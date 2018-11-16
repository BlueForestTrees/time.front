(function() {

    function Scale() {
        this.seventiesInDays = 719528;
        this.yearCalendarLimit = 10000;
        this.dayCalendarLimit = this.yearCalendarLimit * 364.25;
        this.scales = [ 10000000000, 10000, 500, 10 ];
        this.echelles = {
            milliard : 1000000000,
            million : 1000000,
            millier : 1000,
            un : 1
        };
    }

    /**
     * The default Scale is the farest
     * @returns {number}
     */
    Scale.prototype.defaultScale = function(){
        return 0;
    };

    Scale.prototype.dayToHuman = function(day){
        return this.bucketToHuman({day:day});
    };

    Scale.prototype.bucketToRightFilter = function(bucket){
        bucket.x++;
        return this.bucketToFilter(bucket);
    };

    Scale.prototype.bucketToFilter = function(bucket){
        var years = this.bucketToYears(bucket);
        var days = this.bucketToDays(bucket);
        var filter = "";
        var echelle = this._getEchelle(years);

        switch (echelle) {
            case this.echelles.milliard:
                filter = "@" + this._round(years / this.echelles.milliard, 1) + "M";
                break;
            case this.echelles.million:
                filter = "@" + this._round(years / this.echelles.million, 1) + "m";
                break;
            case this.echelles.millier:
            case this.echelles.un:
                if(!this._insideCalendarLimit(years)){
                    filter = "@" + Math.min(years);
                }else{
                    filter = "@" + this._formatDateFilter(this._daysToDate(days));
                }
                break;
            default:
        }
        return filter;
    };

    Scale.prototype.bucketToHuman = function(bucket) {
        var years = this.bucketToYears(bucket);
        var start = this._getStart(years);
        var human = "";
        switch (this._getEchelle(years)) {
            case this.echelles.milliard:
                var nbard = this._positiveRound(years / this.echelles.milliard, 1);
                human = start + nbard + " milliard" + (nbard > 1 ? "s" : "") + " d'années";
                break;
            case this.echelles.million:
                var nbon = this._positiveRound(years / this.echelles.million, 1);
                human = start + nbon + " million" + (nbon > 1 ? "s" : "") + " d'années";
                break;
            case this.echelles.millier:
            case this.echelles.un:
                if(bucket.scale === "0"){
                    human = "De nos jours";
                }else {
                    human = "en " + Math.round(years);
                }
                break;
            default:
        }
        return human;
    };

    Scale.prototype._round = function(value, dec) {
        var negative = value > 0 ? 1 : -1;
        return this._positiveRound(value, dec)*negative
    };

    Scale.prototype._positiveRound = function(value, dec) {
        //dec      = 0,  1,   2,    3
        //decimals = 1, 10, 100, 1000
        var decimals = Math.pow(10,dec);
        return Math.abs(Math.round(value * decimals) / decimals);
    };

    /**
     *
     * @param years
     * @returns {number}
     * @private
     */
    Scale.prototype._getEchelle = function(years) {
        years = Math.abs(Math.round(years));
        if (Math.round(years / this.echelles.milliard) > 0) {
            return this.echelles.milliard;
        } else if (Math.round(years / this.echelles.million) > 0) {
            return this.echelles.million;
        } else if (Math.round(years / this.echelles.millier) > 0) {
            return this.echelles.millier;
        } else {
            return this.echelles.un;
        }
    };

    Scale.prototype.bucketToYears = function(bucket) {
        return this._daysToYears(this.bucketToDays(bucket));
    };

    Scale.prototype.bucketToDays = function(bucket){
        if(bucket.day || bucket.day === 0){
            return bucket.day;
        }
        return this.scales[bucket.scale] * bucket.x;
    };

    Scale.prototype._daysToYears = function(days) {
        if (Math.abs(days) > this.dayCalendarLimit) {
            return days / 364.25;
        } else {
            return this._daysToDate(days).getFullYear();
        }
    };

    Scale.prototype._daysToDate = function(days){
        var msForEpoch = (days - this.seventiesInDays) * 24 * 60 * 60 * 1000;
        return new Date(msForEpoch);
    };

    Scale.prototype._getStart = function(years) {
        return years > 0 ? 'Dans ' : 'Il y a ';
    };

    Scale.prototype._formatDateFilter = function(date){
        return leadingZero(date.getDate()) + "/" +  leadingZero(date.getMonth()+1) + "/" +  date.getFullYear();
    };

    function leadingZero(value){
        if(value < 10){
            return "0"+value;
        }else{
            return ""+value;
        }
    }

    Scale.prototype._insideCalendarLimit = function(year){
        return year > 1800 && year < 2050;
    };

    Time.Scale = Scale;

})();
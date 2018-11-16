(function() {
    function Phrases() {
        this.lastSearch = null;
        this.isSearching = false;
    }

    Phrases.prototype.install = function() {
        Time.view.phrases.on('dblclick.Textes', this.onPhrasesDblClick);
        Time.view.window.on('scroll', $.proxy(this.scroll, this));
    };

    Phrases.prototype.onPhrasesDblClick = function(event) {
        event.stopImmediatePropagation();
        if (window.getSelection()) {
            var term = window.getSelection().toString().trim();
            Time.filter.onFilter(term);
        }
    };

    Phrases.prototype.loadPhrases = function() {
        Time.view.throbber.show();
        var lastKey = null;
        Time.data.getPhrases(Time.filter.term, lastKey, $.proxy(this.onFirstPhrases, this));
    };

    Phrases.prototype.onFirstPhrases = function(phrases) {
        if (phrases.total > 0) {
			var day = phrases.phraseList[0].date;
            var humanDate = Time.scale.dayToHuman(day);
            Time.phrasesdrawer.addTextIntro(humanDate, phrases.total);
        }
        this.onPhrases(phrases);
    };

    Phrases.prototype.onPhrases = function(phrases) {
        Time.view.throbber.hide();
        Time.phrasesdrawer.setPhrases(phrases, Time.filter.term);
        this.isSearching = false;
        if (phrases.lastKey) {
            this.lastSearch = {
                lastKey : phrases.lastKey
            };
            this.maybeMorePhrases();
        } else {
            this.lastSearch = null;
            if(!phrases.alternatives){
                Time.phrasesdrawer.addTheEnd();
            }
        }
    };

    Phrases.prototype.scroll = function() {
        this.maybeMorePhrases();
        if (Time.view.window.scrollTop() < 20) {
            Time.tooltips.showTooltips();
        } else {
            Time.tooltips.hideTooltips();
        }
    };

    Phrases.prototype.maybeMorePhrases = function() {
        if (!this.isSearching && this.lastSearch && this.isBottomVisible()) {
            this.isSearching = true;
            Time.view.throbber.show();
            Time.data.getPhrases(Time.filter.term, this.lastSearch.lastKey, $.proxy(this.onPhrases, this));
        }
    };

    Phrases.prototype.isBottomVisible = function() {
        var docViewBottom = Time.view.window.scrollTop() + Time.view.window.height();
        var elemBottom = Time.view.bottom.offset().top + Time.view.bottom.height();
        return (elemBottom - 500) <= docViewBottom;
    };

    Phrases.prototype.clearText = function() {
        Time.view.phrases.empty();
        $(window).scrollTop(0);
    };

    Time.Phrases = Phrases;
})();
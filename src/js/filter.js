(function() {
    function Filter() {
        this.term = null;
    }

    Filter.prototype.install = function(view) {
        view.termInput.on("keyup",$.proxy(this.termInputKeyPress, this));
        view.homeTermInput.on("keyup",$.proxy(this.homeTermInputKeyPress, this));
    };

//HOME
    Filter.prototype.homeTermInputKeyPress = function(e) {
        if (e.which === 13) {
            this.homeTermInputKeyEnterPress();
        }
    };

    Filter.prototype.homeTermInputKeyEnterPress = function() {
        var term = Time.view.homeTermInput.val();
        this.onFilterFromHome(term, false);
    };

    Filter.prototype.onFilterFromHome = function(term, ignoreHistory){
        Time.view.homeTermInput.off("keyup");
        Time.view.home.remove();
        Time.view.content.show();
        delete Filter.prototype.homeTermInputKeyEnterPress;
        delete Filter.prototype.homeTermInputKeyPress;
        delete Filter.prototype.onFilterFromHome;
        Filter.prototype.onFilterFromHome = this.onFilter;
        delete Time.view.homeTermInput;
        delete Time.view.home;

        this.onFilter(term, ignoreHistory);
    };
//!HOME

    Filter.prototype.termInputKeyPress = function(e) {
        if (e.which === 13) {
            this.termInputKeyEnterPress();
        } else {
            this.checkGetSynonymsTrigger();
        }
    };


    Filter.prototype.checkGetSynonymsTrigger = function() {
        var saisie = Time.view.termInput.val();
        var term = saisie.trim();
        var isTwoSpace = saisie.endsWith('  ');
        var isOneWord = !term.includes(' ');

        if (isTwoSpace && isOneWord) {
            Time.data.getSynonyms(term, $.proxy(this.onSynonyms, this));
        }
    };

    Filter.prototype.onSynonyms = function(synonyms) {
        var saisie = Time.view.termInput.val().trim();
        var newSaisie = saisie + ' ' + synonyms.join(' ');
        Time.view.termInput.val(newSaisie);
        Time.view.termInput[0].selectionStart = saisie.length;
        Time.view.termInput[0].selectionEnd = newSaisie.length;
    };

    Filter.prototype.termInputKeyEnterPress = function() {
        var term = Time.view.termInput.val();
        this.onFilter(term);
    };

    //Lancement d'une recherche
    Filter.prototype.onFilter = function(term, ignoreHistory) {
        this.term = term;
        Time.anal.ga('send', 'event', 'search', term);
        Time.view.termInput.val(term);
        Time.phrases.clearText();
        Time.phrases.lastSearch = null;
        Time.phrases.loadPhrases();

        if (!ignoreHistory) {
            Time.historic.pushState(term);
        }
    };

    Filter.prototype.onPeriodFilter = function (leftFilter, rightFilter) {
        this.onFilter(applyFilters(Time.view.termInput.val(), leftFilter, rightFilter));
    };

    /**
     * Remplace les filters existants dans term par ceux spécifiés.
     * @param term
     * @param leftFilter ajouté à term
     * @param rightFilter ajouté si différent de left
     * @returns {string}
     */
    function applyFilters(term, leftFilter, rightFilter){
        var partArray = term.split(" ").filter(removeUndesired);
        partArray.push(leftFilter);
        if(leftFilter !== rightFilter){
            partArray.push(rightFilter);
        }
        return partArray.join(" ");
    }

    function removeUndesired(part){
        return (part || "").length > 0 && part.charAt(0) !== "@";
    }

    Time.Filter = Filter;
})();
(function() {

    function Data() {

    }

    Data.prototype.getBuckets = function(term, callback) {
        var params = {
            term : term
        };
        Time.anal.ga('send', 'event', 'buckets', term);
        $.get("api/buckets", params).done(callback);
    };

    Data.prototype.getPhrases = function(request, lastKey, callback) {
        var params = {
            request : request,
            lastKey : lastKey
        };
        Time.anal.ga('send', 'event', 'phrases', request);
        $.get("api/phrases", params).done(callback);
    };

    Data.prototype.getSynonyms = function(term, callback) {
        var params = {
            term : term
        };
        Time.anal.ga('send', 'event', 'synonyms', term);
        $.get("api/synonyms", params).done(callback);
    };

    Time.Data = Data;

})();
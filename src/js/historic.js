(function() {
    Time.historic = {};

    Time.historic.term = "";

    Time.historic.popState = function() {
        var url = document.location.href;

        if(url.indexOf("/") > -1){
            Time.historic.term = decodeURIComponent(url.split("/")[url.split("/").length-1].substring(1));
        }
        if (Time.historic.term) {
            Time.filter.onFilterFromHome(Time.historic.term, true);
        }
    };

    Time.historic.pushState = function(term) {
        if (Time.historic.term !== term) {
            history.pushState("", "", "/#" + encodeURIComponent(term));
        }
    };

})();

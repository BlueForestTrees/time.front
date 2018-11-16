(function() {

    Time.anal = {};

    Time.anal.init = function() {
        if(document.location.hostname !== 'localhost'){
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments);
                }, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
            Time.anal.on = true;
        }else{
            console.log('No GA since localhost');
        }
    };

    Time.anal.ga = function(a, b, c, d, e) {
        if (Time.anal.on) {
            ga(a, b, c, d, e);
        }
    };

})();
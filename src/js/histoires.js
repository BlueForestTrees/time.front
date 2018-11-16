(function() {
    function Histoires() {
        Time.scale = new Time.Scale();
        Time.view.throbber.hide();
        Time.barFactory = new Time.BarFactory();
        //Time.bar = new Time.Bar();
        //Time.barLoading = new Time.BarLoading();
        //Time.barDrawer = new Time.BarDrawer();
        Time.phrases = new Time.Phrases();
        Time.phrasesdrawer = new Time.PhrasesDrawer();
        Time.data = new Time.Data();
        Time.filter = new Time.Filter();
        Time.tooltips = new Time.Tooltip();

        //Time.barDrawer.install();
        Time.filter.install(Time.view);
        Time.phrases.install();

        Time.historic.popState();
        window.onpopstate = Time.historic.popState;
    }

    Time.Histoires = Histoires;

})();

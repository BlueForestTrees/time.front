
$(document).ready(function() {
    Time.view = {
        termInput : $("#termInput"),
        homeTermInput : $('#homeTermInput'),
        bottom : $(".bottom"),
        timeline : $(".timelines"),
        phrases : $('.phrases'),
        window : $(window),
        activeBarTips : [ $("#activeBarTip1"), $("#activeBarTip2"), $("#activeBarTip3") ],
        throbber : $(".throbber"),
        home : $(".home"),
        content : $(".content")
    };
    Time.anal.init();
    Time.anal.ga('create', 'UA-70863369-1', 'auto');
    Time.anal.ga('send', 'pageview', '/');
    Time.histoires = new Time.Histoires();
});
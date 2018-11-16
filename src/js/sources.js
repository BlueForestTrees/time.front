(function(){
    Time.sources = {
            'FILE' : {
                'tipTextHeader' : 'Lien vers le livre',
                'imgUrl' : 'http://www.ecoagris.org/AjaxControls/KoolTreeView/icons/book.gif',
                'getPageName' : function(phrase){
                    return phrase.title;
                },
                'getAuthor' : function(phrase){
                    return phrase.author
                }
            },
            'WIKI' : {
                'tipTextHeader' : 'Lien vers l\'article',
                'imgUrl' : 'http://upload.wikimedia.org/wikipedia/commons/6/64/Icon_External_Link.png',
                'getPageName' : function(phrase){
                    return decodeURIComponent(phrase.url).split(/[\/]+/).pop().replace(/_/g, " ");
                },
                'getAuthor' : function(phrase){
                    return 'Wikipédia'
                }
            },
            'WEB_PAGE' : {
                'tipTextHeader' : 'Lien vers la page web',
                'imgUrl' : 'img/browser-world-globe-planet-icone-8648-16.png',
                'getPageName' : function(phrase){
                    return phrase.title;
                },
                'getAuthor' : function(phrase){
                    return phrase.author
                }
            }
    };
})();
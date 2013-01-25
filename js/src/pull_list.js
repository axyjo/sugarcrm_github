
var GH = GHSugarParser;
var foo = function() {
    $("h3 a").each(function(i, e) {
        var $e = $(e);
        chrome.extension.sendMessage({method: "getKey", key: "show_tracker_links"}, function(p) {
            if(!$e.hasClass('GHSugar-processed') && p && p.data == "true") {
                $(GHSugarParser.run($e.text())).each(function(j, obj) {
                    $("<a></a>").attr('href', obj.url).text(obj.source).insertAfter($e.parent());
                });
                $e.addClass('GHSugar-processed');
            }
        });
    });
};

$(document).on('click', "a.filter-tab, a.filter-item, .pagination a", function() {
    setTimeout(foo, 1500);
});

foo();

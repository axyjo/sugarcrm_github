chrome.extension.sendMessage({method: "getKey", key: "autoredirect_whitespace"}, function(p) {
    if(p && p.data == "true") {
        if(window.location.href.indexOf("/files") !== -1) {
            if(window.location.href.indexOf("?w=1") === -1) {
                var hash = window.location.hash;
                var base = window.location.href.replace(hash, '')
                window.location.href =  + "?w=1" + hash;
            }
        }
        var link = $(".tabnav-tabs a[data-container-id=files_bucket]");
        var url = link.attr('href', link.attr('href') + "?w=1");
    }
});

chrome.extension.sendMessage({method: "getKey", key: "show_whitespace_buttons"}, function(p) {
    if(p && p.data == "true") {
        var txt = "Show Whitespace Changes", url = "?";
        if(window.location.href.indexOf("?w=1") === -1) {
            txt = "Hide Whitespace Changes", url = "?w=1";
        }
        var el = $("<a></a>");
        el.addClass('minibutton').attr('href', url).text(txt).insertBefore($(".show-diff-stats"));
    }
});

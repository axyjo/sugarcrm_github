chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getKey") {
        console.log(localStorage, request.key, localStorage[request.key]);
        sendResponse({data: localStorage[request.key] || null});
    } else if(request.method == "setKey") {
        localStorage[request.key] = request.value || null;
    } else if(request.method == "setSIKey") {
        var obj1 = JSON.parse(localStorage["si_cache"]);
        obj[request.key] = request.value;
        localStorage["si_cache"] = JSON.stringify(obj);
    } else if (request.method == "getSIKey") {
        var obj2 = JSON.parse(localStorage["si_cache"]);
        sendResponse({data: obj[request.key] || null});
    } else {
        sendResponse({});
    }
});

GHSugarParser = {
    run: function (str) {
        var a = [];
        return a.concat(this.jira(str), this.si(str));
    },

    jira: function(str) {
        var ret = [],
            regex = /([A-Z]+-[0-9]+)/g,
            matches = (str).match(regex);
        $(matches).each(function(i, e) {
            ret.push({
                source: "JIRA - " + e,
                url: "http://sugarcrm.atlassian.net/browse/" + e
            });
        });
        return ret;
    },

    si: function(str) {
        var ret = [],
            regex = /([0-9]{5,7})/g,
            matches = (str).match(regex);

        GHSugarApi.cacheIds(matches);

        $(matches).each(function(i, e) {
            var bug_url = GHSugarApi.getBugUrl(e);
            if(bug_url) {
                ret.push({
                    source: "SI - #" + e,
                    url: bug_url
                });
            }
        });
        return ret;
    }
};

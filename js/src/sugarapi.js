GHSugarApi = {

    logged_in: false,

    token: localStorage["GHSugar_token"] || null,

    key: 'GHSugar_',

    url_prefix: "https://sugarinternal.sugarondemand.com/index.php?action=DetailView&module=Bugs&record=",

    cacheIds: function(bug_nums) {
        var self = this;
        if(!this.logged_in) {
            this.login();
        }

        var to_get = [];

        if(bug_nums !== null) {
            for (var i = bug_nums.length - 1; i >= 0; i--) {
                if(!this.getKey(bug_nums[i])) {
                    to_get.push(bug_nums[i]);
                }
            }
        }


        if(to_get.length) {
            var query = 'bug_number IN (' + to_get.join(',') + ')';
            var data = [
                'Bugs',
                query, null, null, ['id', 'bug_number']
            ];

            var callback = function(obj) {
                $(obj.entry_list).each(function(i, e) {
                    var o = e.name_value_list;
                    self.setKey(o.bug_number.value, o.id.value);
                });
                setTimeout(function() {
                    window.location.href = window.location.href;
                }, 4500);
            };

            this.request('get_entry_list', data, callback);
        }

    },

    getBugUrl: function(num) {
        var val = this.getKey(num);
        if(val) {
            return this.url_prefix + val;
        }
        return false;
    },

    login: function(cb) {
        var self = this;
        var callback = function(obj) {
            if(obj.number == 10) {
                console.error("Bad login provided for Sugar Internal");
                return;
            }
            //console.log(obj);
            self.setToken(obj.id);
            self.logged_in = true;
            if(cb) {
                cb();
            }
        };
        chrome.extension.sendMessage({method: "getKey", key: "si_username"}, function(user) {
            chrome.extension.sendMessage({method: "getKey", key: "si_password"}, function(pw) {
                var data = {
                    'user_auth': {
                        'user_name': user.data,
                        'password': pw.data
                    }
                };
                self.request('login', data, callback);
            });
        });
    },

    request: function(method, data, callback) {
        var self = this;
        var c = function() {
            console.log("3", data, method);
            var url = "https://sugarinternal.sugarondemand.com/service/v2/rest.php?input_type=JSON&response_type=JSON";
            $.ajax(url + "&method=" + method + "&rest_data=" + JSON.stringify(data), {
                success: callback,
                dataType: "json",
                type: "POST"
            });
        };
        if(method !== "login") {
            chrome.extension.sendMessage({method: "getKey", key: "si_token"}, function(token) {
                if(!token || !token.data) {
                    self.login(c);
                }
                if(token.data && method !== 'get_user_id') {
                    self.request('get_user_id', [token.data], function(obj) {
                        if(obj.number == 11) {
                            self.login(c);
                        } else {
                            self.logged_in = true;
                            //console.log("1", data, method);
                            data.unshift(token.data);
                            //console.log("2", data, method);
                            c();
                        }
                    });
                } else if(token.data) {
                    //console.log("4", data, method);
                    c();
                }
            });
        } else {
            c();
        }
    },

    setToken: function(token) {
        this.token = token;
        chrome.extension.sendMessage({method: "setKey", key: "si_token", value: token});
    },

    getCache: function() {
        return JSON.parse(localStorage.getItem('GHSugar_SI')) || {};
    },

    clearCache: function() {
        localStorage.setItem('GHSugar_SI', '{}');
    },

    getKey: function(key) {
        var o = this.getCache();
        return o[key] || null;
    },

    setKey: function(key, value){
        var o = this.getCache();
        o[key] = value;
        localStorage.setItem('GHSugar_SI', JSON.stringify(o));
    }
};

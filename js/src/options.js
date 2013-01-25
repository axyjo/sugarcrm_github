jQuery(document).ready(function($) {
    $(".saveme").each(function(i, e) {
        var name = $(e).attr('name');
        if(name && localStorage[name]) {
            $(e).val(localStorage[name]);
        }
    });
    $(document).on('change', ".saveme", function() {
        var name = $(this).attr('name');
            val = $(this).val();
        if($(this).attr('type') == 'password') {
            val = md5(val);
        }
        if(name) {
            localStorage[name] = val;
        }
    });
});


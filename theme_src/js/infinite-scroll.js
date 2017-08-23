jQuery(function($){


    const container = '.home #genesis-content'; // DOM element containing post_types


    if (typeof(gs_infinite) !== 'undefined') {

        $(container).append('<span class="load-more"></span>');
        var button = $(container + ' .load-more');
        var page = 2;
        var loading = false;
        var scrollHandling = {
            allow: true,
            reallow: function () {
                scrollHandling.allow = true;
            },
            delay: 400 //(milliseconds) adjust to the highest acceptable value
        };

        $(window).scroll(function () {
            if (!loading && scrollHandling.allow) {
                scrollHandling.allow = false;
                setTimeout(scrollHandling.reallow, scrollHandling.delay);
                var offset = $(button).offset().top - $(window).scrollTop();
                if (2000 > offset) {
                    loading = true;
                    var data = {
                        action: gs_infinite.action,
                        page: page,
                        post_type: gs_infinite.post_type,
                    };
                    $.get(gs_infinite.url, data, function (res) {
                        if (res.success) {
                            $(container).append(res.data);  //add returned data to container
                            $(container).append(button);    //move element that determines end of container after new data
                            page = page + 1;
                            loading = false;
                        } else {
                            // console.log(res);
                        }
                    }).fail(function (xhr, textStatus, e) {
                        // console.log(xhr.responseText);
                    });

                }
            }
        });
    }
});

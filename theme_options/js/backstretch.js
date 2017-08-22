(function( $ ){
//  This can be placed in the myscripts.js

    $('document').ready(function() {

        //local_fwp comes from WP

        $('body.home').backstretch(local_fwp.backstretch, {
            duration: 6000,
            transitionDuration: 'normal',
            preload: 0
        })
    });

})(jQuery);

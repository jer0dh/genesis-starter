(function( $ ){

/* javascript code goes here.  Will run after page is loaded in the DOM */


    $('document').ready(function() {

        /* Sticky NAV code
        --------------------------------------------------------------------
         */


        $('.site-header').sticky({
            responsiveWidth: true,
            widthFromWrapper: true,
            zIndex: 999
        });

        var updateSticky = debounce(function () {
            $('.site-header').sticky('update');

        }, 250);

        window.addEventListener('resize', updateSticky);

        /* END Sticky NAV code
        -----------------------------------------------------------------------
         */

    });

})(jQuery);

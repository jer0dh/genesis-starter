(function( $ ){

/* javascript code goes here.  Will run after page is loaded in the DOM */


    $('document').ready(function() {

        /* Sticky NAV code
        --------------------------------------------------------------------
         */

        //removeIf(production)
        console.log( 'starting scripts.js');
        //endRemoveIf(production)

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

        /* Sticky NAV code - sticky-kit
        -------------------------------------------------------------------------
         */

/*        $('.site-header').stick_in_parent();
        $('.nav-primary').stick_in_parent();*/

        /* END Sticky NAV code - sticky-kit
        -------------------------------------------------------------------------
         */


    });

})(jQuery);

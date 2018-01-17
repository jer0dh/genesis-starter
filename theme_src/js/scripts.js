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

        /* Sticky NAV code - sticky-kit
        -------------------------------------------------------------------------
         */

/*        $('.site-header').stick_in_parent();
        $('.nav-primary').stick_in_parent();*/

        /* END Sticky NAV code - sticky-kit
        -------------------------------------------------------------------------
         */



        let slideout = new Slideout({
            'panel' : document.querySelector('.site-container'),
            'menu'  : document.querySelector('.site-sidebar'),
            'padding' : 256,
            'tolerance' : 70

        });

        $GsBus.onP('testing', { name: 'first'},  function(e, a) {
            console.log(e.data);  // {name: 'first'}
            console.log(a);       // {name: 'fromTrigger'}
        });
        $GsBus.onP('testing.2', function(e, a) {
            console.log('wow');
            console.log(e.data);       // undefined
            console.log(a);            // {name: 'fromTrigger'}
        });

        $GsBus.triggerP('testing', [{name: 'fromTrigger'}]);
    });

})(jQuery);

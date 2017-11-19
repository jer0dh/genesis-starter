(function( $ ){

/* javascript code goes here.  Will run after page is loaded in the DOM */


    $('document').ready(function() {

        $('.nav-primary').sticky();

        /* helps update sticky if user resizes the browser */
        var updateSticky = debounce(function () {
            $('.nav-primary').sticky('update');

        }, 250);


        window.addEventListener('resize', updateSticky);


    });

})(jQuery);

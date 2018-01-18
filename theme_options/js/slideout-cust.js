(function( $ ){


    $('document').ready(function() {

        /* Slideout.js code
        --------------------------------------------------------------------
         */


        let slideout = new Slideout({
            'panel' : document.querySelector('.site-container'),
            'menu'  : document.querySelector('.site-sidebar'),
            'padding' : 256,
            'tolerance' : 70,
            'side'  : 'right'

        });

        // Clone primary nav to site-sidebar and remove classes for super-fish as we do not want sub menus to open on hover.
        $('.site-container .nav-primary')
            .clone()
            .appendTo('.site-sidebar')
            .find('.menu')
            .removeClass('js-superfish')
            .removeClass('sf-js-enabled');


        $GsBus.onP('mainMenuInit.5', initSlideoutToMenu );  //Make sure this is the last function to run as we want to remove any other actions

        function initSlideoutToMenu() {
            $GsBus.off('mainMenuOpen'); //remove any other events registered
            $GsBus.onP('mainMenuOpen', slideOutMenu );
        }

        function slideOutMenu(e, el) {
            let $this = $( el );
            _toggleAria( $this, 'aria-pressed' );
            _toggleAria( $this, 'aria-expanded' );
            $this.toggleClass( 'activated' );
            //$('.site-sidebar .nav-primary').appendTo('.site-sidebar');
            slideout.toggle();

        }

        /**
         * On opening of sidebar menu, make site-container clickable to close.  Add event listeners on window resize to close sidebar on resize.
         */

        slideout.on('beforeopen', function() {
                $('.site-container').on('click.slideoutClose', function(e) {
                    e.preventDefault();
                    slideout.close();
                });
                $(window).on('resize.slideoutClose', function() {
                    slideout.close();
                    $(window).off('resize.slideoutClose');
                })
            });

        /**
         * turn off event listener of site-container when sidebar closes
         */
        slideout.on('beforeclose', function() {
           $('.site-container').off('click.slideoutClose');


             });


        /**
         * Toggle aria attributes.
         * @param  {button} $this     passed through
         * @param  {aria-xx} attribute aria attribute to toggle
         * @return {bool}           from _ariaReturn
         */
        function _toggleAria( $this, attribute ) {
            $this.attr( attribute, function( index, value ) {
                return 'false' === value;
            });
        }


    });

})(jQuery);

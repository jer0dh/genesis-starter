(function( $ ){

/* javascript code goes here.  Will run after page is loaded in the DOM */


    $('document').ready(function() {


        //removeIf(production)
        console.log( 'starting scripts.js');
        //endRemoveIf(production)


        /* Sticky NAV code
        --------------------------------------------------------------------


       $('.site-header').sticky({
            responsiveWidth: true,
            widthFromWrapper: true,
            zIndex: 999
        });

        var updateSticky = debounce(function () {
            $('.site-header').sticky('update');

        }, 250);

        window.addEventListener('resize', updateSticky);

         END Sticky NAV code
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

        /* Sticky Nav code
        ----------------------------------------------------------------------
         */

        const $window = $(window);

        const updateBodyPadding = function() {

            const totalHeight = updateStuckTop();

            //set body padding-top
            $('body').css('padding-top', totalHeight + 'px');


        };

        const getWpAdminBarHeight = function() {
            let wpadminbarHeight = $('#wpadminbar').height();
            if( wpadminbarHeight === null) {
                wpadminbarHeight = 0;
            }
            return wpadminbarHeight;
        };

        const getStuckHeight = function() {

            const wpadminbarHeight = getWpAdminBarHeight();

            const $stickies = $('.stuck');

            //Get total height of all already fixed at the top
            return $stickies.toArray().reduce( ( height, sticky ) => {
                return height += $(sticky).height();
            }, wpadminbarHeight);
        };

        const updateStuckTop = function() {

            const wpadminbarHeight = getWpAdminBarHeight();

            const $stickies = $('.stuck');

            //Update css 'top' while getting total height of all already fixed at the top
            return $stickies.toArray().reduce( ( height, sticky ) => {
                $(sticky).css('top', height + 'px');
                return height += $(sticky).height();
            }, wpadminbarHeight);
        };

        const updateBodyPaddingOnResize = new Debouncer(updateBodyPadding);
        //  const updateStickiesOnResize = debounce( updateStickies, 200, true);

        // run on resize event
        $window.on('resize', updateBodyPaddingOnResize.handleEvent.bind(updateBodyPaddingOnResize) );


        let previousScrollTop = $window.scrollTop();
        let updating = false;
        const stickiesGettingStuckOrSticky = function() {
            if (!updating) {
                updating = true;
                const currentScrollTop = $window.scrollTop();
                const currentStickyBottom = getStuckHeight() + currentScrollTop;

                if( previousScrollTop < currentScrollTop ) {   // Scrolling Down

                    let $possibleStickies = $('.sticky').toArray();

                    let update = false;
                    $possibleStickies.forEach(function (e) {
                        const stickyTop = $(e).offset().top;
                        if (stickyTop <= currentStickyBottom ) {
                            $(e).removeClass('sticky').addClass('stuck').data('docBottom', stickyTop + $(e).height());
                            update = true;
                        }
                        if(update) {
                            updateBodyPadding();
                        }
                    });
                } else   {                                     // Scrolling Up
                    let $alreadyStuck = $('.stuck').toArray();

                    let update = false;

                    console.log('sb: ' + currentStickyBottom);
                    $alreadyStuck.forEach(function (e) {
                        const originalDocBottom = $(e).data('docBottom');
                        console.log(originalDocBottom);
                        if (originalDocBottom >= currentStickyBottom ) {
                            $(e).removeClass('stuck').addClass('sticky');
                            update = true;
                        }
                    });

                    if (update) {
                        updateBodyPadding();
                    }
                }
                previousScrollTop = currentScrollTop;
               /*
                let $possibleStickies = $('.sticky').toArray();
                let $alreadyStuck = $('.stuck').toArray();

                let update = false;


                $alreadyStuck.forEach(function (e) {
                    const stuckTop = $(e).offset().top;
                    if (stuckTop > scroll_position) {
                        $(e).removeClass('stuck').addClass('sticky');
                        update = true;
                    }
                });

                if (update) {
                    updateStickiesOnResize.handleEvent();
                }
*/
            }
            updating = false;

        };

        const stickiesGettingStuckOrStickyOnScroll = new Debouncer( stickiesGettingStuckOrSticky );

        $window.on('scroll', stickiesGettingStuckOrStickyOnScroll.handleEvent.bind(stickiesGettingStuckOrStickyOnScroll))





    });

})(jQuery);

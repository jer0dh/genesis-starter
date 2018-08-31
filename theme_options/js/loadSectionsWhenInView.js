/**
 * Not meant to run as is.  Usually copy & pasted into a theme script file.  Needs function in responsiveBackgroundImages.js
 *
 * Loads in the modules that are wrapped in section tags with the class not-loaded.  This code will run a function on the section
 * when it comes into view that will load background images.
 *
 * on page load, runs function to check for sections in the viewport and then adds to the 'scroll' event to check as screen is scrolled
 *
 * Requires code from responsiveBackgroundImages.js, imageLoaded library, debounce.js
 */


/**
 * https://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
 * @constructor
 */
function Utils() {

}

Utils.prototype = {
    constructor: Utils,
    isElementInView: function (element, fullyInView) {
        let pageTop = $(window).scrollTop();
        let pageBottom = pageTop + $(window).height();
        let elementTop = $(element).offset().top;
        let elementBottom = elementTop + $(element).height();

        if (fullyInView === true) {
            return ((pageTop < elementTop) && (pageBottom > elementBottom));
        } else {
            return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
        }
    }
};

var Utils = new Utils();


(function ($) {

    $('document').ready(function () {

        // Check if sections are in view.  If so, load images, and remove .not-loaded

        const $sectionsToLoad = $('section.banner');

        const loadInView = function () {
            $sectionsToLoad.filter('.not-loaded').each(function (i, section) {
                let $section = $(section);
                if (Utils.isElementInView(section)) {

                    // other functions can be run here such as lazy loading of other images


                    let $bgImgs = $section.find('.responsive-background-image');
                    if ($bgImgs.length > 0) {
                        $bgImgs.each(function () {
                            loadBgImg(this);
                        })
                    }
                    $section.imagesLoaded({background: true})
                        .always(function () {

                            $section.removeClass('not-loaded');
                        });

                }
            });

        };
        //run Load in view on page load for all sections already in viewport
        loadInView();

        const onScrollLoadInView = new Debouncer(function () {
            loadInView();
        });

        //Check for new sections in viewport on scroll event (debounced to prevent performance issues)
        $(window).on('scroll', onScrollLoadInView.handleEvent.bind(onScrollLoadInView));


    });

})(jQuery);
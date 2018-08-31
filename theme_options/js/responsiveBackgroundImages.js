(function( $ ) {

    $('document').ready(function () {


        /**
         * This section looks for img tags in elements not loaded with the class responsive-background-image
         * It will change the data-src and data-srcset to src and src-set so the browser can choose which image to load
         * Once loaded the script will copy the src to the background of the slide and then remove the img tag
         * Class not-loaded is used to keep the slide's opacity at 0 until it is removed after image is loaded.
         *
         */

        /**
         * Function to call to load a responsive background image to parent element
         * @param el
         */
        const loadBgImg = function (el) {
            let $this = $(el);

            //Read in the data-srcset attributes of this img tag

            let dataSrcSet = $this.data('srcset');

            if (dataSrcSet) {
                $this.attr('srcset', dataSrcSet);
                let $parent = $this.parent();
                $this.removeClass('responsive-background-image');
                // imagesLoaded will run the function once the image is fully loaded to the browser
                $parent.imagesLoaded(function () {
                    //once image is loaded, see which image size the browser chose based on the srcset
                    let backgroundSrc = (typeof $this[0].currentSrc !== 'undefined') ? $this[0].currentSrc : $this.data('fallback');
                    let orig = $parent.css('background-image'); //get any existing image (linear gradient)
                    $parent.css('background-image', orig + ',url("' + backgroundSrc + '")');
                    $this.remove(); //remove img tag from markup
                    $parent.addClass('responsive-background-image-loaded');
                });

            }
        };

    });

})(jQuery);
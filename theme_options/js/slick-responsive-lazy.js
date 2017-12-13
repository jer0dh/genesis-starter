
/* Slick Slider code
-----------------------------------------------------------------------
 */
$('.slides').slick({
    dots: true
});


/**
 * This section looks for img tags in slides not loaded with the class responsive-background-image
 * It will change the data-src and data-srcset to src and src-set so the browser can choose which image to load
 * Once loaded the script will copy the src to the background of the slide and then remove the img tag
 * Class slide-not-loaded is used to keep the slide's opacity at 0 until it is removed after image is loaded.
 * Otherwise one will see the text content on a white background during load
 *
 * The markup for the img tag should appear as child of the slide div.  The src and srcset attributes should be empty and their values
 * should be stored in data-src and data-srcset, respectively.  This should be done on the server.
 *
 * <img src="" class="attachment-full size-full lazyload-slide responsive-background-image" alt="" srcset=""
 * sizes="(max-width: 637px) 100vw, 637px" data-src="https://staging10.gitt.jhtechservices.com/wp-content/uploads/2017/11/Screen-Shot-2017-08-23-at-2.10.30-PM.jpg"
 * data-srcset="https://staging10.gitt.jhtechservices.com/wp-content/uploads/2017/11/Screen-Shot-2017-08-23-at-2.10.30-PM.jpg 637w,
 * https://staging10.gitt.jhtechservices.com/wp-content/uploads/2017/11/Screen-Shot-2017-08-23-at-2.10.30-PM-300x282.jpg 300w" />
 *
 * NOTE: resizing the browser after page loads will not change the image src.
 *
 */
let $slides = $('.slide-not-loaded'); /*find all slides not loaded */
let $bgImg = $slides.find('.responsive-background-image'); /* get all img that will become the parent element's background */

$bgImg.each(function() {
    let $this = $(this);

    // Read in the data-src and data-srcset attributes of this img tag
    let dataSrc = $this.data('src');
    let dataSrcSet = $this.data('srcset');

    if (dataSrc) {
        $this.attr('srcset', dataSrcSet);
        $this.attr('src', dataSrc);
        let $parent = $this.parent();
        $parent.addClass('loading-image');
        // imagesLoaded will run the function once the image is fully loaded to the browser
        $parent.imagesLoaded(function () {
            //once image is loaded, see which image size the browser chose based on the srcset
            let backgroundSrc = (typeof $this[0].currentSrc !== 'undefined') ? $this[0].currentSrc : $this.attr('src');
            $parent.css('background-image', 'url("' + backgroundSrc + '")');
            $this.remove(); //remove img tag from markup
            $parent.removeClass('slide-not-loaded');
            $parent.removeClass('loading-image');
        });

    }
});


/* END Slick Slider code
-----------------------------------------------------------------------
 */

/*
Used to throttle how often something is called especially in event listeners.

Ex.
        var updateSticky = debounce(function () {
            $('.site-header').sticky('update');

        }, 250);


        window.addEventListener('resize', updateSticky);

 */



function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * From https://github.com/WickyNilliams/headroom.js/blob/3282c23bc6 @type {((callback: FrameRequestCallback) => number) | *}
 */

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

/**
 * Handles debouncing of events via requestAnimationFrame
 * @see http://www.html5rocks.com/en/tutorials/speed/animations/
 * @param {Function} callback The callback to handle whichever event
 */
function Debouncer (callback) {
    this.callback = callback;
    this.ticking = false;
}
Debouncer.prototype = {
    constructor : Debouncer,

    /**
     * dispatches the event to the supplied callback
     * @private
     */
    update : function() {
        this.callback && this.callback();
        this.ticking = false;
    },

    /**
     * ensures events don't get stacked
     * @private
     */
    requestTick : function() {
        if(!this.ticking) {
            requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this)));
            this.ticking = true;
        }
    },

    /**
     * Attach this as the event listeners
     */
    handleEvent : function() {
        this.requestTick();
    }
};
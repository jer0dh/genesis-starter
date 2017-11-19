
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
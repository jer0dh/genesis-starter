/**
 * Creates a global event/message bus that can be used throughout the life of the web page.
 *
 * Uses jQuery on, off, trigger
 *
 * Data can be passed at the time of setting 'on' or data can be passed at the time it is 'trigger'ed
 *
 * Data passed using 'on' must be the second argument of 'on' as an Object.  It can be accessed in the trigger
 * callback in the event.data.  See examples below.
 *
 * Data can be passed to the callback by passing in an array of arguments when event is 'trigger'ed.  See example below
 *
 *
 *
 * */


if(typeof window.$GsBus === 'undefined') {
    window.$GsBus = jQuery({});  //create a global event bus using jQuery bound to a new empty object

    /**
     * Override jQuery trigger with it's triggerHandler function (no need for bubbling)
     */
    $GsBus.trigger = function() {

        $GsBus.triggerHandler.apply(this,arguments);
    }
}

/*

$GsBus.on('testing', { name: 'first'},  function(e, a) {
    console.log(e.data);  // {name: 'first'}
    console.log(a);       // {name: 'fromTrigger'}
});
$GsBus.on('testing', function(e, a) {
    console.log('wow');
    console.log(e.data);       // undefined
    console.log(a);            // {name: 'fromTrigger'}
});

$GsBus.trigger('testing', [{name: 'fromTrigger'}]);
*/
/**
 * Creates a global event/message bus that can be used throughout the life of the web page.  It also extends
 * jQuery to add .onP and .triggerP functions on any jQuery object.
 *
 * .onP is the same as .on except it will automatically add a namespace of '3' if no namespace is added.
 * .triggerP will trigger an 'event' in order of the namespaces.  Starting with '1' and ending with '5'
 *
 * This is similar to the Wordpress Action/Hook pattern so that one can give certain callbacks priority.
 *
 *
 * Just as when using .on or .trigger, data can be passed at the time of setting 'onP' or data can be passed at the time
 * the event is triggered
 *
 * Data passed using 'onP' must be the second argument of 'onP' as an Object.  It can be accessed in the trigger
 * callback in the event.data.  See examples below.
 *
 * Data can also be passed to the callback by passing in an array of arguments when event is triggered.  See example below
 *
 * Uses jQuery triggerHandler since no need for bubbling
 * */


jQuery.fn.extend({

    triggerP: function (event) {

        let priorities = ['1', '2', '3', '4', '5'];
        let args = Array.from(arguments);
        let ev = event.split('.');
        if (typeof (ev[1]) !== 'undefined') {

            this.triggerHandler.apply(this, args);

        } else {

            for(let x in priorities) {
                args[0] = event + '.' + priorities[x];

                this.triggerHandler.apply(this, args);
            }
        }

    },

    onP: function (event) {
        let ev = event.split('.');
        if (typeof (ev[1]) === 'undefined') {
            arguments[0] = event + '.3';
        }

        this.off.apply(this, arguments);  //prevent binding multiple times
        this.on.apply(this, arguments);
    }
});

if(typeof window.$GsBus === 'undefined') {

        window.$GsBus = jQuery({});  //create a global event bus using jQuery bound to a new empty object
}

/*

        $GsBus.onP('testing', { name: 'first'},  function(e, a) {
            console.log(e.data);  // {name: 'first'}
            console.log(a);       // {name: 'fromTrigger'}
        });
        $GsBus.onP('testing.2', function(e, a) {
            console.log('wow');
            console.log(e.data);       // undefined
            console.log(a);            // {name: 'fromTrigger'}
        });

        $GsBus.triggerP('testing', [{name: 'fromTrigger'}]);  // Each element in the array is a parameter of the callback
*/

/* Finding list of events bound to an element

$._data($(elem).get(0), "events")
$._data($GsBus.get(0), "events")
 */
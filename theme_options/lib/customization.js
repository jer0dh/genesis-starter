/**
 * Used to provide live preview of setting changes in the Theme Customization panel
 *
 */

( function( $ ) {

    wp.customize( 'footer_bg_color', function( value ) {
        value.bind( function( newval ) {
            $('#footer').css( 'background-color', newval );
        } );
    } );

} )( jQuery );
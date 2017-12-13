<?php
// Add the before and after markup of the nav 'ul'
// Here we are adding a search form

/* This could be copied to functions.php.  One can change the hook/filter to put the search form where ever you need it in the page */

add_filter( 'wp_nav_menu_args', 'gitt_nav_menu_args' );

function gitt_nav_menu_args($args) {


//Check to make sure we are dealing with primary menu
if( 'primary' === $args['theme_location']) {

$post_menu = '<div class="wsearch hide-opacity">' . genesis_search_form() . '</div>';
$args['items_wrap'] = '<ul id="%1$s" class="%2$s">%3$s</ul>' . $post_menu;
}

return $args;
}

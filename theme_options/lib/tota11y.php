<?php

/*
 * Creates a fixed button on lower left side to look for accessibility issues using http://khan.github.io/tota11y/
 *
 * Need to copy tota11y.js to /js/vendor
 *
 * Add this to wp-config.php on the host
 * define('WP_DEBUG', true);
 */

// The page template will enqueue registered scripts only if they are needed
add_action( 'wp_enqueue_scripts', 'gs_enqueue_script_tota11y' );


function gs_enqueue_script_tota11y() {

	if(defined('WP_DEBUG') && WP_DEBUG ) {
		wp_enqueue_script( 'gs_tota11y', get_stylesheet_directory_uri() . '/js/vendor/tota11y.js', array(), '1.0.0', true );

	}

}
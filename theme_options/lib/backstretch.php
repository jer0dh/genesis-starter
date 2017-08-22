<?php

add_action( 'wp_enqueue_scripts', 'gs_enqueue_css_js' );

function gs_enqueue_css_js() {
	$version = wp_get_theme()->Version;

	wp_enqueue_style( 'gs_combined_css', get_stylesheet_directory_uri() . '/css/style.min.css', array(), $version );


	$images = get_field( 'home_page_background_images', 'options' );  //From ACF

	/**
	 *
	This is an example of using Advanced Custom Fields Gallery field so the user can select
	the background images in the WordPress dashboard.  In this example, it will be using backstretch's ability to load smaller
	images on smaller screens.
	 */
	$sizes                = array( 'large' => 301, "medium" => 151 );
	$local                = array();
	$local['backstretch'] = array();
	if ( $images ) {
		foreach ( $images as $image ) {
			$imgArray = array();
			foreach ( $sizes as $name => $size ) {
				if ( isset( $image['sizes'][ $name ] ) ) {
					$imgArray[] = array( "width" => $size, "url" => esc_url( $image['sizes'][ $name ] ) );
				}
			}
			$imgArray[]             = array( "width" => 1025, "url" => esc_url( $image['url'] ) ); //get full image
			$local['backstretch'][] = $imgArray;
		}
	}

	wp_localize_script(
		'gs_combined_js', // slug of enqueued js script
		'local_fwp',
		$local
	);
}

/**
 * Add overlay
 */
add_action( 'genesis_before', 'gs_add_backstretch_overlay' );
function gs_add_backstretch_overlay() {
	echo '<div class="backstretch_overlay"></div>';

}
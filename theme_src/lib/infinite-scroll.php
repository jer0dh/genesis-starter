<?php
if( !defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Contains code to provide Infinite scroll features.
 * Much of the code is based on Bill Erickson's
 * @link http://www.billerickson.net/infinite-scroll-in-wordpress
 */


/**
 * AJAX Load More

 */

add_action( 'wp_ajax_gs_ajax_load_more', 'gs_ajax_load_more' );
add_action( 'wp_ajax_nopriv_gs_ajax_load_more', 'gs_ajax_load_more' );

function gs_ajax_load_more() {
	global $wp_query;

	$args = array();

	$args['post_type'] = isset( $_GET['post_type'] ) ? esc_attr( $_GET['post_type'] ) : 'post';
	$args['paged'] = isset($_GET['page'])? esc_attr( $_GET['page'] ) : 1;
	$args['post_status'] = 'publish';

	ob_start();
	$wp_query = new WP_Query( $args );
	if( $wp_query->have_posts() ):

		while( $wp_query->have_posts() ): $wp_query->the_post();

			gs_post_markup();

	    endwhile;
	endif;

	wp_reset_query();

	$data = ob_get_clean();
	wp_send_json_success( $data );
	wp_die();
}


/**
 *  localize the config for javascript functions
 *
 */

add_action( 'wp_enqueue_scripts', 'gs_localize_config' );

function gs_localize_config() {
   global $wp_query;
		$query = $wp_query->query;
		$local = array(
			'action'        => 'gs_ajax_load_more',
			'post_type'     => isset($query['post_type'])? $query['post_type']: 'post',
			'url'           => admin_url( 'admin-ajax.php' )
		);

		wp_localize_script(
			GS_MAIN_SCRIPT,
			'gs_infinite',
			$local
		);
}

function gs_post_markup() {
	$link    = get_the_permalink();
	$title   = get_the_title();
	$excerpt = get_the_excerpt();
	$feature = wp_get_attachment_image( get_post_thumbnail_id(), 'medium' );

	echo '<div class="col-md-4 col-sm-6 blog-masonry-item update">
								<div class="item-inner">';

	echo '<a href="' . esc_url( $link ) . '">' . $feature . '</a>';
	echo '<div class="post-title"><h2>' . esc_textarea( $title ) . '</h2><p>' . esc_textarea( $excerpt ) . '</p>';
	echo '<a href="' . esc_url( $link ) . '" class="link-text">Read More</a></div></div></div>';
}


<?php


//* ACF settings ----------------------------------------------------------------------------------------


// Hide ACF field group menu item
//add_filter('acf/settings/show_admin', '__return_false');


/* adding more security to ACF fields by sanitizing input */
/* from: http://www.advancedcustomfields.com/resources/acf_form/#security */
add_filter('acf/update_value', 'gtl_kses_post', 10, 1);
function gtl_kses_post( $value ) {

	// is array
	if( is_array($value) ) {

		return array_map('gtl_kses_post', $value);

	}

	// return
	return wp_kses_post( $value );

}


// add function to retrieve ACF field values without wpautop
function get_the_field_without_wpautop( $field_name, $post_id ) {

	remove_filter('acf_the_content', 'wpautop');
	$field = get_field( $field_name, $post_id );
	add_filter('acf_the_content', 'wpautop');

	return $field;

}// add function to retrieve ACF field values without wpautop
function get_the_sub_field_without_wpautop( $field_name ) {

	remove_filter('acf_the_content', 'wpautop');
	$field = get_sub_field( $field_name );
	add_filter('acf_the_content', 'wpautop');

	return $field;
}

// add Theme options page using ACF
if( function_exists('acf_add_options_page') ) {

	acf_add_options_page('Theme Settings');
}

// BEGIN Code to add titles to flex layout on backend

// Add item name to layout title on backend
add_filter('acf/fields/flexible_content/layout_title', 'acf_flexible_content_layout_title', 10, 4);

// Add acf filter to add titles to flex content layout
function acf_flexible_content_layout_title( $title, $field, $layout, $i ) {


	// load text sub field
	if( $text = get_sub_field('title') ) {

		$title .= ' - <strong>' . wp_strip_all_tags($text) . '</strong>';

	} elseif( $layout['name'] === 'dropdown' && $dropdowns = get_sub_field('dropdowns')) {

		$title .= ' - ';
		foreach($dropdowns as $dropdown) {
			$title .= wp_strip_all_tags($dropdown['title']) . ', ';
		}
		$title = rtrim($title, ', ');
	} elseif( $layout['name'] === 'basic_content' && $content = get_sub_field('content')) {

		$title .= ' - ' . wp_strip_all_tags(substr($content, 0,40)) . '...';
	}

	return $title;

}

// END Code to add titles to flex layout on backend

// BEGIN CODE TO ADD THE ABILITY TO SEARCH ACF fields using WP Search form on the frontend

/**
 * Extend WordPress search to include custom fields
 *
 * https://adambalee.com
 */

/**
 * Join posts and postmeta tables
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_join
 */
function cf_search_join( $join ) {
	global $wpdb;

	if ( is_search() ) {
		$join .= ' LEFT JOIN ' . $wpdb->postmeta . ' ON ' . $wpdb->posts . '.ID = ' . $wpdb->postmeta . '.post_id ';
	}

	return $join;
}

add_filter( 'posts_join', 'cf_search_join' );

/**
 * Modify the search query with posts_where
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_where
 */
function cf_search_where( $where ) {
	global $pagenow, $wpdb;

	if ( is_search() ) {
		$where = preg_replace(
			"/\(\s*" . $wpdb->posts . ".post_title\s+LIKE\s*(\'[^\']+\')\s*\)/",
			"(" . $wpdb->posts . ".post_title LIKE $1) OR (" . $wpdb->postmeta . ".meta_value LIKE $1)", $where );
	}

	return $where;
}

add_filter( 'posts_where', 'cf_search_where' );

/**
 * Prevent duplicates
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_distinct
 */
function cf_search_distinct( $where ) {
	global $wpdb;

	if ( is_search() ) {
		return "DISTINCT";
	}

return $where;
}

add_filter( 'posts_distinct', 'cf_search_distinct' );


// END CODE TO ADD THE ABILITY TO SEARCH ACF fields using WP Search form on the frontend
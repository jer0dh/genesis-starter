
<?php


//* ACF settings ----------------------------------------------------------------------------------------


// Hide ACF field group menu item
//add_filter('acf/settings/show_admin', '__return_false');


/* adding a little more security to ACF fields by sanitizing input */
/* not sanitizing input whose field name contains 'raw_html' */
/* from: http://www.advancedcustomfields.com/resources/acf_form/#security */
add_filter( 'acf/update_value', 'ssp_kses_post', 10, 3 );
function ssp_kses_post( $value, $post_id = null, $field = null ) {


	if ( isset( $field ) && strpos( $field['name'], 'raw_html' ) > - 1 ) {
		return $value;
	}
	if ( ! is_array( $value ) ) {

	return wp_kses_post( $value );

	} else {
		return $value;
	}
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

	acf_add_options_page( array(
		'page_title' => 'Theme Settings',
		'menu_title' => 'Theme Settings',
		'menu_slug'  => 'theme-settings',
		'capability' => 'edit_posts',
		'redirect'   => true
	) );
	acf_add_options_sub_page( array(
		'page_title'  => 'General Settings',
		'menu_title'  => 'General Settings',
		'parent_slug' => 'theme-settings'
	) );
	acf_add_options_sub_page( array(
		'page_title'  => 'Site Wide Banners',
		'menu_title'  => 'Site Wide Banners',
		'parent_slug' => 'theme-settings'
	) );
	acf_add_options_sub_page( array(
		'page_title'  => 'Social Media',
		'menu_title'  => 'Social Media',
		'parent_slug' => 'theme-settings'
	) );

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
	}  elseif ( $layout['name'] === 'generic_block' && $content = get_sub_field( 'content' ) ) {

		$title .= ' - <span>' . wp_strip_all_tags( substr( $content, 0, 60 ) ) . '...</span>';

	} elseif ( $layout['name'] === 'site_wide_banner' && $content = get_sub_field( 'site_wide_banner' ) ) {

		$title .= ' - <span>' . wp_strip_all_tags( $content['label'] ) . '</span>';
	}

	return $title;

}

function ssp_load_background_field_choices( $field ) {

	// reset choices
	$field['choices'] = array();


	// if has rows
	if ( have_rows( 'theme_backgrounds', 'option' ) ) {

		// while has rows
		while ( have_rows( 'theme_backgrounds', 'option' ) ) {

			// instantiate row
			the_row();


			// vars
			$value = get_sub_field( 'class' );
			$label = get_sub_field( 'name' );


			// append to choices
			$field['choices'][ $value ] = $label;

		}

	}


	return $field;

}

// For each select name (must be unique) add a filter
add_filter( 'acf/load_field/name=3c_background_select', 'ssp_load_background_field_choices' );
add_filter( 'acf/load_field/name=swb1_background_select', 'ssp_load_background_field_choices' );
add_filter( 'acf/load_field/name=swb2_background_select', 'ssp_load_background_field_choices' );


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
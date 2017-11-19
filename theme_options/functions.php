<?php
/**
 * Common code to add to functions.php
 *
 */



//* Rename Menus primary and secondary menus
add_theme_support( 'genesis-menus' , array(
	'primary'   => __('Main Menu', 'gtl'),
	'secondary' => __('Top Menu', 'gtl')
) );

//* add title attribute to <a> in menu to allow for bold font without changing the size of a

add_filter( 'nav_menu_link_attributes', 'gtl_add_title_attrib_to_nav', 10, 2 );
function gtl_add_title_attrib_to_nav($attr, $item) {
	$attr['gtitle'] = $item->title;
	return $attr;
}

//* Remove genesis layouts.  Only full width
//* Remove content/sidebar layout
genesis_unregister_layout( 'content-sidebar' );

//* Remove sidebar/content layout
genesis_unregister_layout( 'sidebar-content' );

//* Remove content/sidebar/sidebar layout
genesis_unregister_layout( 'content-sidebar-sidebar' );

//* Remove sidebar/sidebar/content layout
genesis_unregister_layout( 'sidebar-sidebar-content' );

//* Remove sidebar/content/sidebar layout
genesis_unregister_layout( 'sidebar-content-sidebar' );

//* Set full-width content as the default layout
genesis_set_default_layout( 'full-width-content' );



//* Header alterations
require_once( get_stylesheet_directory() . '/lib/header.php' );

//* Ajax functions
require_once( get_stylesheet_directory() . '/lib/ajax-functions.php' );

//* Custom Search functions
require_once( get_stylesheet_directory() . '/lib/search-functions.php' );

//* Commmon functions
require_once( get_stylesheet_directory() . '/lib/common.php' );



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



/* # Footer
----------------------------------------------------------------------------------------- */
remove_action( 'genesis_footer', 'genesis_do_footer' );
add_action( 'genesis_footer', 'gtl_do_footer' );

function gtl_do_footer(){

	$footer_line_1 = get_field('footer_line_1', 'options');
	$before_year = get_field( 'footer_line_2_before', 'options');
	$after_year = get_field( 'footer_line_2_after', 'options');
	$login_url = get_home_url() . '/login';

	echo '<div class="footer-line-1">' . wp_kses_post($footer_line_1) . '</div>';

	echo '<div class="footer-line-2">' . esc_textarea($before_year) . do_shortcode('[footer_copyright copyright=""] ') . esc_textarea($after_year);
	echo '&nbsp;&nbsp; ' . do_shortcode('[gfavs_login_logout]') .' '. do_shortcode('[gfavs_favorite_functions]') . '</div>';


	if( have_rows( 'social_icons', 'options') ){
		echo '<ul class="social-icons">';
		while( have_rows( 'social_icons', 'options' ) ) {
			the_row();

			$icon = get_sub_field('icon');
			$name = get_sub_field('name');
			$url = get_sub_field('url');

			echo '<li>';
			if($url){
				echo '<a href="' . esc_url($url) . '">';
			}
			if($icon){
				echo wp_get_attachment_image( $icon['ID'], 'full', false, array('title' => $name));
			} else {
				echo esc_textarea($name);
			}
			if($url){
				echo '</a>';
			}

		}
		echo '</ul>';
	}
}

/* Adding wraps to all posts and pages at title, at content
-----------------------------------------------------------------------------------------
add_action( 'genesis_entry_header', 'gtl_wrap_open', 6 );
add_action( 'genesis_entry_header', 'gtl_wrap_close', 14 );
add_action( 'genesis_entry_content', 'gtl_wrap_open', 6 );
add_action( 'genesis_entry_content', 'gtl_wrap_close', 11 );
 */




/* #  Shortcodes
----------------------------------------------------------------------------------------- */

/* Allow shortcodes in text widgets
-------------------------------------- */
add_filter('widget_text', 'do_shortcode');

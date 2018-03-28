<?php
/**
 * Common code to add to functions.php
 *
 */

//* Moving Nav to header
remove_action('genesis_after_header', 'genesis_do_nav' );
add_action( 'genesis_header', 'genesis_do_nav', 11 );


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


//* Check for ACF plugin.  Report error if not found

if( ! class_exists('acf') ) {
	// show message to dashboard that ACF plugin is required
	add_action( 'admin_notices',  'gs_plugin_ACF_not_loaded' );

} else {

//* Load ACF functions
	require_once( get_stylesheet_directory() . '/lib/acf.php' );
}

function gs_plugin_ACF_not_loaded() {
	printf( '<div class="error"><p>%s</p></div>', __( 'This theme REQUIRES the Advanced Custom Fields plugin and it is not loaded' ) );
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


/* Adding a wrap around certain elements */

add_theme_support( 'genesis-structural-wraps', array(
	'header',
	'menu-primary',
	'menu-secondary',
	'site-inner',
	'footer-widgets',
	'footer',
) );


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
//remove_filter('widget_text_content', 'wpautop');

/**
 * overwrite gallery shortcode to produce isotope/masonry layout
 * altered from: https://stackoverflow.com/questions/14585538/customise-the-wordpress-gallery-html-layout
 */
add_filter('post_gallery','gitt_format_gallery',10,2);

function gitt_format_gallery($string,$attr){

	$posts_order_string = $attr['ids'];
	$posts_order = explode(',', $posts_order_string);


	$posts = get_posts(array(
		'include' => $posts_order,
		'post_type' => 'attachment',
		'orderby' => 'post__in'
	));

	if($attr['orderby'] == 'rand') {
		shuffle($posts);
	}

	$output = '<div class="grid grid-gallery-shortcode" >

            <div class="grid-sizer"></div>
            <div class="gutter-sizer"></div>';
	add_filter( 'wp_get_attachment_image_attributes', 'gitt_lazyload_image_markup' );

	foreach($posts as $imagePost){

		$output .= '<div class="grid-item grid-item-expandable"> ';
		$output .=  wp_get_attachment_image( $imagePost->ID, 'large');
		$output .= '</div>';

	}

	$output .= "</div>";
	remove_filter( 'wp_get_attachment_image_attributes', 'gitt_lazyload_image_markup' );
	return $output;
}

/**
 * Returns an unordered list of social media icons that are from the Theme Settings
 *
 * @param string $class
 *
 * @return string
 */
function gitt_get_social_icons($class = '', $wrap = true, $li_class = '') {

	$return = '';
	if(have_rows('social_media', 'options')){
		if ($wrap) {
			$return .= '<ul class="social-icons ' . esc_attr( $class ) . '">';
		}
		while(have_rows('social_media', 'options')) {
			the_row();
			$icon  = get_sub_field( 'icon' );
			$image = get_sub_field( 'image' );
			$name  = get_sub_field( 'name' );
			$url   = get_sub_field( 'url' );

			if ( $icon ) {
				$iconHtml = '<span class="icon ' . esc_attr( $icon ) . '"></span>';
			} elseif ( $image ) {
				$iconHtml = wp_get_attachment_image( $image['ID'], 'thumbnail', true, array( 'alt' => $name ) );
			} else {
				$iconHtml = $name;
			}
			$return .= '<li class="'. $li_class .'">';
			$return .= '<a target="_blank" href="' . esc_url( $url ) . '">';
			$return .= $iconHtml;
			$return .= '</a></li>';
		}

		if($wrap) {
			$return .= '</ul>';
		}
	}
	return $return;
}

/* Add social icons to mobile menu */

add_filter('wp_nav_menu_items', 'add_admin_link', 10, 2);
function add_admin_link($items, $args){
	if( $args->theme_location == 'primary' ){
		$items .= gitt_get_social_icons('', false, 'menu-item menu-item-mobile');
	}
	return $items;
}

// Add the before and after markup of the nav 'ul'
// Here we are adding a search form
add_filter( 'wp_nav_menu_args', 'gitt_nav_menu_args' );

function gitt_nav_menu_args($args) {


	//Check to make sure we are dealing with primary menu
	if( 'primary' === $args['theme_location']) {

		$post_menu = '<div class="wsearch hide-opacity">' . genesis_search_form() . '</div>';
		$args['items_wrap'] = '<ul id="%1$s" class="%2$s">%3$s</ul>' . $post_menu;
	}

	return $args;
}


// change default footer and add ACF fields that should be configured in theme settings

# Footer
remove_action( 'genesis_footer', 'genesis_do_footer' );
add_action( 'genesis_footer', 'gtl_do_afooter' );

function gtl_do_afooter(){

	$before_year = get_the_field_without_wpautop( 'footer_before', 'options');
	$after_year = get_the_field_without_wpautop( 'footer_after', 'options');
	$login_url = get_home_url() . '/login';

	echo '<div class="footer-copyright"><div class="wrap">' . wp_kses_post($before_year) . do_shortcode('[footer_copyright copyright=""] ') . wp_kses_post($after_year) .'</div></div>';

}



//* add sidebar
genesis_register_sidebar( array(
	'id'        => 'sidebar-name',
	'name'      => 'Sidebar Name',
	'description'   => 'This is a sidebar that will appear ...',
) );


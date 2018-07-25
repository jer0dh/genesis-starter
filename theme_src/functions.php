<?php

if( !defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


//* Start the Genesis engine
include_once( get_template_directory() . '/lib/init.php' );

// Child theme definitions
define( 'CHILD_THEME_NAME', '<%= pkg.templateName %>' );
define( 'CHILD_THEME_URL', '<%= pkg.templateUri %>' );
define( 'CHILD_THEME_VERSION', '<%= pkg.version %>' );


// Remove genesis style.css - only theme info
remove_action( 'genesis_meta', 'genesis_load_stylesheet' );

// ENQUEUE Scripts and Styles used throughout.  REGISTER Scripts and Styles that MIGHT be loaded depending on page template.
// The page template will enqueue registered scripts only if they are needed
add_action( 'wp_enqueue_scripts', 'gtl_enqueue_scripts_styles' );

define('GS_MAIN_SCRIPT', 'gs_scripts');

function gtl_enqueue_scripts_styles() {

	$version = wp_get_theme()->Version;

	wp_enqueue_style( 'dashicons' );


	wp_enqueue_style( 'gtl_css', get_stylesheet_directory_uri() . '<% if(production){%>/css/style.min.css<% } else { %>/css/style.css<% } %>', array(), $version );

    wp_enqueue_style( 'google-font', '//fonts.googleapis.com/css?family=Muli:400,600,700,800', array() );

	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '<% if(production){%>.min<% } %>';  //Gulptask in dev environment will put in '.min' if dev is set for production

	wp_enqueue_script( GS_MAIN_SCRIPT, get_stylesheet_directory_uri() . "/js/scripts{$suffix}.js", array( 'jquery' ), $version, true );


	wp_enqueue_script( 'genesis-responsive-menu', get_stylesheet_directory_uri() . "/js/responsive-menu{$suffix}.js", array( 'jquery' ), $version, true );
	wp_localize_script(
		'genesis-responsive-menu',
		'genesis_responsive_menu',
		genesis_sample_responsive_menu_settings()
	);

}
// Update CSS within in Admin
function gtl_admin_style() {
	$version = wp_get_theme()->Version;
	wp_enqueue_style('admin-styles', get_stylesheet_directory_uri() . '/css/admin-style.min.css', array(), $version );
}
add_action('admin_enqueue_scripts', 'gtl_admin_style');

// Define our responsive menu settings.
function genesis_sample_responsive_menu_settings() {

	$settings = array(
		'mainMenu'          => __( '', 'genesis-sample' ),
		'menuIconClass'     => 'dashicons-before dashicons-menu',
		'subMenu'           => __( 'Submenu', 'genesis-sample' ),
		'subMenuIconsClass' => 'dashicons-before dashicons-arrow-down-alt2',
		'menuClasses'       => array(
			'combine' => array(
				'.nav-primary'
			),
			'others'  => array('.nav-secondary'),
		),
	);

	return $settings;

}

//* Add HTML5 markup structure
add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list' ) );

//* Add Accessibility support
add_theme_support( 'genesis-accessibility', array( 'headings', 'drop-down-menu',  'search-form', 'skip-links', 'rems' ) );

//* Add viewport meta tag for mobile browsers
add_theme_support( 'genesis-responsive-viewport' );

add_theme_support( 'header-image');

//* Add support for custom background
add_theme_support( 'custom-background' );

//* Add support for post-thumbnails
add_theme_support('post-thumbnails');

//* Gutenberg wide images support - still need to add css to support

add_theme_support( 'align-wide' );

/* Add support for 3-column footer widgets
add_theme_support( 'genesis-footer-widgets', 3 );


// change default footer and add ACF fields that should be configured in theme settings

 # Footer
remove_action( 'genesis_footer', 'genesis_do_footer' );
add_action( 'genesis_footer', 'gtl_do_footer' );

function gtl_do_footer(){

	$before_year = get_the_field_without_wpautop( 'footer_before', 'options');
	$after_year = get_the_field_without_wpautop( 'footer_after', 'options');
	$login_url = get_home_url() . '/login';

	echo '<div class="footer-copyright"><div class="wrap">' . wp_kses_post($before_year) . do_shortcode('[footer_copyright copyright=""] ') . wp_kses_post($after_year) .'</div></div>';

}

*/

add_theme_support( 'genesis-structural-wraps', array(
	 'header',
	'menu-primary',
	'menu-secondary',
	'site-inner',
	'footer-widgets',
	'footer',
	) );

/*
/* add sidebar
genesis_register_sidebar( array(
	'id'        => 'sidebar-name',
	'name'      => 'Sidebar Name',
	'description'   => 'This is a sidebar that will appear ...',
) );
 */

/* Remove genesis layouts.  Leave full-width-content and content-sidebar.
*/
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

//* Moving Nav to header
remove_action('genesis_after_header', 'genesis_do_nav' );
add_action( 'genesis_header', 'genesis_do_nav', 11 );

//* Add stickiness to header
add_filter( 'genesis_attr_site-header', 'gs_add_sticky_class');
function gs_add_sticky_class($attributes) {
	$attributes['class'] .= ' sticky';
	return $attributes;
}
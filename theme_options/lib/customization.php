<?php
/**
 * This file has a basic skeleton to add options to the Customize option under Appearance.
 *
 * It includes a skeleton to offer live preview when the option is changed.
 *
 * Most of the code is based on https://premium.wpmudev.org/blog/wordpress-theme-customization-api/
 * and https://premium.wpmudev.org/blog/creating-custom-controls-wordpress-theme-customizer/
 */

class My_Customizer {

	function __construct() {
		add_action( 'customize_register' , array( $this , 'register' ) );
		add_action( 'wp_head' , array( $this , 'header_output' ) );
		add_action( 'customize_preview_init' , array( $this , 'live_preview' ) );
	}
	public function register($wp_customize) {
		// Sections, settings and controls will be added here

		//Add a section
		$wp_customize->add_section(
			'mytheme_footer_options',
			array(
				'title'       => __( 'Footer Settings', 'mytheme' ),
				'priority'    => 100,
				'capability'  => 'edit_theme_options',
				'description' => __('Change footer options here.', 'mytheme'),
			)
		);


		// Add a setting
		$wp_customize->add_setting( 'footer_bg_color',
			array(
				'default' => 'f1f1f1',
				'transport' => 'postMessage'  //needed if doing live preview
			)
		);

		// Add a control

		$wp_customize->add_control( new WP_Customize_Color_Control(
			$wp_customize,
			'footer_bg_color_control',
			array(
				'label'    => __( 'Footer Background Color', 'mytheme' ),
				'section'  => 'mytheme_footer_options',
				'settings' => 'footer_bg_color',
				'priority' => 10,
			)
		));
	}



	public function header_output() {
		// The live CSS is added here

		?>
		<style type='text/css'>
			#site-footer {
				background-color:#<?php echo get_theme_mod('footer_bg_color') ?> ;
			}
		</style>
		<?php


	}
	public function live_preview() {
		// The live preview is enqueued here if live preview is needed

		wp_enqueue_script(
			'my_theme_customizer',
			get_template_directory_uri() . '/theme-customizer.js',  //path to script goes here
			array(  'jquery', 'customize-preview' ),
			'',
			true
		);
	}
}


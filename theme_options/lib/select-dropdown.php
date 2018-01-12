<?php


/**
 * adding multiple select
 * this modifies the wp_dropdown_categories output for multiple select dropdown.
 * To use add a 'multiple' key to the args send to array sent to wp_dropdown_categories().
 * This filter will then parse that array and add the appropriate multiple attribute to the select tag
 * and it will take the 'selected' key as an array or comma-delimited list and add the 'selected' attribute
 * to matching option tags
 *
 * Ex.
 * 		$dropdown = wp_dropdown_categories(array(
			'orderby'           =>      'slug',
			'echo'              =>      0,
			'class'             =>      'select2-all',
			'show_option_none'   =>     $gallery_all_category_name,
			'option_none_value' =>      $gallery_all_category->slug,
			'selected'          =>      $active_cat,
			'value_field'       =>      'slug',
			'name'              =>      'tax',
			'taxonomy'          =>      'media_category',
			'hide_empty'        =>      false,
			'multiple'          =>      true
			) );

 */


add_filter( 'wp_dropdown_cats',  'wp_dropdown_cats_multiple', 10, 2 );


/**
 * See https://wordpress.stackexchange.com/questions/216070/wp-dropdown-categories-with-multiple-select
 */
function wp_dropdown_cats_multiple( $output, $r ) {

	if( isset( $r['multiple'] ) && $r['multiple'] ) {

		$output = preg_replace( '/^<select/i', '<select multiple="multiple"', $output );


		$output = str_replace( "name='{$r['name']}'", "name='{$r['name']}[]'", $output );

		$selected = is_array($r['selected']) ? $r['selected'] : explode( ",", $r['selected'] );
		foreach ( array_map( 'trim', $selected ) as $value )
			$output = str_replace( "value=\"{$value}\"", "value=\"{$value}\" selected", $output );

	}

	return $output;
}

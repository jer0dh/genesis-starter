<?php

// 	add_filter( 'wp_get_attachment_image_attributes', 'gs_image_markup_responsive_background',10,2 );
/**
 * Removes the src and srcset attributes and puts then in data attributes. This allows lazy loading.  This also adds a
 * data-fallback that the responsiveBackground script code will use for IE 11
 *
 * @param $attributes
 * @param null $image
 *
 * @return mixed
 */
function gs_image_markup_responsive_background( $attributes, $image = null ) {

	if ( isset( $attributes['src'] ) ) {
		$attributes['data-src'] = $attributes['src'];
		$attributes['src']      = ''; //could add default small image or a base64 encoded small image here
	}
	if ( isset( $attributes['srcset'] ) ) {
		$attributes['data-srcset'] = $attributes['srcset'];
		$attributes['srcset']      = '';
	}
	if ( $image ) {  //mainly for IE 11 support
		$attributes['data-fallback'] = wp_get_attachment_image_url( $image->ID, 'large' );
	}

	return $attributes;

}

/**
 * Creates a style entry adding a background $color with $opacity.
 *
 * @param string $color
 * @param int $opacity
 *
 * @return string
 */
function gs_background_markup( $color = '', $opacity = 1 ) {

	$rtn = '';

	if ( ! ( '' === $color ) ) {
		$rgba = 'rgba(' . hex2rgb( $color ) . ',' . $opacity . ')';
		$rtn  .= 'linear-gradient(' . $rgba . ',' . $rgba . ')'; //no-repeat center center/cover

		return 'background-image: ' . $rtn;
	}

	return $rtn;
}

/**
 * Creates img tag markup loading an svg but adding the 'onerror' attribute that will load a fallback png on error.
 *
 * @param $svg url to svg file
 * @param $bck  fallback png url
 * @param array $additional attributes to add to img tag
 *
 * @return string
 */
function gs_svg_img_markup( $svg, $bck, $additional = array() ) {
	$img_array = array_merge( $additional, array('onerror' => 'this.onerror=null; this.src=\'' . esc_url($bck['url']) .'\'' ) );
	return wp_get_attachment_image($svg['ID'], 'full', false, $img_array );
}

/**
 * From https://bavotasan.com/2011/convert-hex-color-to-rgb-using-php/
 *
 * @param $hex
 *
 * @return string
 */
function hex2rgb( $hex ) {
	$hex = str_replace( "#", "", $hex );

	if ( strlen( $hex ) == 3 ) {
		$r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
		$g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
		$b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
	} else {
		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );
	}
	$rgb = array( $r, $g, $b );

	return implode( ",", $rgb ); // returns the rgb values separated by commas
	//return $rgb; // returns an array with the rgb values
}

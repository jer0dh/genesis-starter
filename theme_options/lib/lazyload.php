<?php

/**
 * Adds filter that will provide proper lazy load markup when images are added to page using the wp_get_attachment_image() function
 *
 * See this article for more details: https://jhtechservices.com/changing-your-image-markup-in-wordpress/
 *
 * Assuming we don't want lazy load on images in the header; we start the filter at 'genesis_after_header'
 *
 * NOTE: this will not change markup for img tags in the post_content (see below for that)
 */

//* Lazyload image functions
/*require_once( get_stylesheet_directory() . '/lib/lazyload.php' );*/



add_action( 'genesis_after_header', 'gs_add_image_filter' );
add_action( 'genesis_after_footer', 'gs_remove_image_filter' );


function gs_add_image_filter() {
	add_filter( 'wp_get_attachment_image_attributes', 'gs_change_attachment_image_markup' );
}
function gs_remove_image_filter() {
	remove_filter( 'wp_get_attachment_image_attributes', 'gs_change_attachment_image_markup' );
}

add_filter( 'wp_get_attachment_image_attributes', 'gs_change_attachment_image_markup' );


/**
 * Change src and srcset to data-src and data-srcset, and add class 'lazyload'
 * @param $attributes
 *
 * @return mixed
 */
function gs_change_attachment_image_markup($attributes){

	if (isset($attributes['src'])) {
		$attributes['data-src'] = $attributes['src'];
		$attributes['src']      = ''; //could add default small image or a base64 encoded small image here
	}
	if (isset($attributes['srcset'])) {
		$attributes['data-srcset'] = $attributes['srcset'];
		$attributes['srcset'] = '';
	}
	$attributes['class'] .= ' lazyload';
	return $attributes;

}



/**
 * Can use 'wp_get_attachment_image_attributes' filter to add lazy loading attributes for feature image and any time
 * wp_get_attachment_image() is used to create image markup.
 *
 * Images in the post_content get their responsive attributes when it goes through 'the_content' filter, specifically:
 * add_filter( 'the_content', 'wp_make_content_images_responsive' );  Discovered this by https://wordpress.stackexchange.com/questions/211375/how-do-i-disable-responsive-images-in-wp-4-4
 *
 * Unfortunately, 'wp_make_content_images_responsive' does not have any filters to hook into to make changes so a similar function
 * hooked to 'the_content' filter would have to be created to add the lazy loading markup.  It would need to be hooked with a priority so it runs
 * after the 'wp_make_content_images_responsive'
 *
 */

/**
 *
 * Modified from: Sunyatasattva
 * https://wordpress.stackexchange.com/questions/81522/change-html-structure-of-all-img-tags-in-wordpress
 * @param $the_content
 *
 * @return string
 *
 *
 * Initial use of code gave warning: DOMDocument::loadHTML(): Unexpected end tag : p
 * Due to invalid HTML
 *
 * https://stackoverflow.com/questions/11819603/dom-loadhtml-doesnt-work-properly-on-a-server
 *
 * libxml_use_internal_errors(true);
 */


function gs_add_img_lazy_markup($the_content) {
	// Create a new istance of DOMDocument
	libxml_use_internal_errors(true);
	$post = new DOMDocument();
	// Load $the_content as HTML
	$post->loadHTML($the_content);
	// Look up for all the <img> tags.
	$imgs = $post->getElementsByTagName('img');

	// Iteration time
	foreach( $imgs as $img ) {
		// Let's make sure the img has not been already manipulated by us
		// by checking if it has a data-src attribute (we could also check
		// if it has the fs-img class, or whatever check you might feel is
		// the most appropriate.
		if( $img->hasAttribute('data-src') ) continue;

		// Also, let's check that the <img> we found is not child of a <noscript>
		// tag, we want to leave those alone as well.
		if( $img->parentNode->tagName == 'noscript' ) continue;

		// Let's clone the node for later usage.
		$clone = $img->cloneNode();

		// Get the src attribute, remove it from the element, swap it with
		// data-src
		$src = $img->getAttribute('src');
		$img->removeAttribute('src');
		$img->setAttribute('data-src', $src);


		$srcset = $img->getAttribute('srcset');
		$img->removeAttribute('srcset');
		if( ! empty($srcset)) {
			$img->setAttribute('data-srcset', $srcset);
		}


		// Same goes for width...
		/*$width = $img->getAttribute('width');
		$img->removeAttribute('width');
		$img->setAttribute('data-width', $width);*/

		// And height... (and whatever other attribute your js may need
		/*$height = $img->getAttribute('height');
		$img->removeAttribute('height');
		$img->setAttribute('data-height', $height);*/

		// Get the class and add fs-img to the existing classes
		$imgClass = $img->getAttribute('class');
		$img->setAttribute('class', $imgClass . ' lazyload');

		// Let's create the <noscript> element and append our original
		// tag, which we cloned earlier, as its child. Then, let's insert
		// it before our manipulated element
		$no_script = $post->createElement('noscript');
		$no_script->appendChild($clone);
		$img->parentNode->insertBefore($no_script, $img);
	};

	return $post->saveHTML();
}

add_filter('the_content', 'gs_add_img_lazy_markup', 15);


/**
 *  If we wanted to change the markup of an image before it is inserted into the content, we can use this:
 * https://www.sitepoint.com/wordpress-change-img-tag-html/
 *
 * This will change the img tag on the edit screen in the content...but we do not want to change the src tag to data-src at this point.
 *
 * This function would change the class which would be fine to do when the img tag is inserted in the content.
 *
 * function image_tag_class($class, $id, $align, $size) {
 *   return $align . ' aclassname';
 *  }
 *  add_filter('get_image_tag_class', 'image_tag_class', 0, 4);
 *
 *
 * This function can change more of the image tag before it is inserted into content.
 * function image_tag($html, $id, $alt, $title) {
return preg_replace(array(
'/'.str_replace('//','//',get_bloginfo('url')).'/i',
'/s+width="d+"/i',
'/s+height="d+"/i',
'/alt=""/i'
),
array(
'',
'',
'',
'alt="' . $title . '"'
),
$html);
}
 * add_filter('get_image_tag', 'image_tag', 0, 4);
 */

/*function image_tag_class($class, $id, $align, $size) {
	return $class . ' lazy';
  }
add_filter('get_image_tag_class', 'image_tag_class', 10, 4);*/

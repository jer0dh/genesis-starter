<?php

$id = get_sub_field( 'id' );

$content = get_sub_field( 'content', false );

$classes = get_sub_field( 'additional_classes' );
$classes = ( $classes ) ? $classes : '';

$bg_select = get_sub_field( 'background_select_generic_block' );

$has_background_image = get_sub_field( 'has_background_image' );

if ( $has_background_image ) {
	$bg_select               = '';
	$content_bg_image        = get_sub_field( 'background_image' );
	$content_overlay         = get_sub_field( 'background_overlay' );
	$content_overlay_opacity = get_sub_field( 'background_overlay_opacity' );
}

if ( $bg_select ) {
	$classes .= ' banner not-loaded ' . $bg_select;
} else {
	$classes .= ' banner not-loaded gs_bg_transparent';
}
$attributes = '';
if ( $id ) {
	$attributes .= ' id="' . esc_attr( $id ) . '" ';
}

$attributes .= ' class="' . esc_attr( $classes ) . '"';

$font_color = get_sub_field( 'font_color' );
if ( $font_color ) {
	$attributes .= ' style="color:' . esc_attr( $font_color ) . ';"';
}

add_filter( 'wp_get_attachment_image_attributes', 'gs_image_markup_responsive_background', 10, 2 );

?>

    <section <?php echo $attributes; ?>>
		<?php if ( $has_background_image ) : ?>
            <div class="background-image-holder"
                 style="<?php echo gs_background_markup( $content_overlay, $content_overlay_opacity / 100 ); ?>">
				<?php echo wp_get_attachment_image( $content_bg_image['ID'], 'full', false, array( 'class' => 'responsive-background-image' ) ); ?>
            </div>
		<?php endif; ?>
        <div class="wrap">
			<?php echo do_shortcode( wpautop( wp_kses_post( $content ) ) ); ?>
        </div>
    </section>

<?php
remove_filter( 'wp_get_attachment_image_attributes', 'gs_image_markup_responsive_background', 10, 2 );


/*

get_sub_field will run wpautop on the wysiwyg field.  Using custom function this
wpautop is not run.

With wpautop and shortcodes in content, finding wp is adding empty <p></p> where it shouldn't.
If there was an unordered list there were <p></p> before and after the <ul></ul>.

Do_shortcode is also run by get_sub_field.

Still want wpautop for those that use visual tab.  So running it after.

Finding the results of the shortcode going through the wpautop will also add p tags between
certain tags.  If I used div for the icon as opposed to a span.  With the div an extra p
tag was added.  Using h3 instead of span also caused extra p tag.

*/
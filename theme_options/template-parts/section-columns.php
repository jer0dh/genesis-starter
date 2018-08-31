<?php

$id = get_sub_field( 'id' );

$content = get_sub_field( 'content', false );

$classes = get_sub_field( 'additional_classes' );
$classes = ( $classes ) ? $classes : '';

$classes .= ' banner banner-columns not-loaded';


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
$col = 0;
?>
    <section <?php echo $attributes; ?>>
        <div class="wrap">
			<?php if ( have_rows( 'columns' ) ): ?>
                <div class="container">
                    <div class="row">

						<?php while ( have_rows( 'columns' ) ) : the_row();

							$size                 = get_sub_field( 'size' );
							$has_background_image = get_sub_field( 'has_background_image' );

							if ( $has_background_image ) {
								$bg_select               = '';
								$bg_image                = get_sub_field( 'background_image' );
								$content_overlay         = get_sub_field( 'background_overlay' );
								$content_overlay_opacity = get_sub_field( 'background_overlay_opacity' );
								$has_overlay             = get_sub_field( 'has_overlay' );
							}
							$font_color        = get_sub_field( 'font_color' );
							$content           = get_sub_field( 'content', false );
							$mobile_order      = get_sub_field( 'mobile_order' );
							$show_on_mobile    = get_sub_field( 'show_on_mobile' );
							$minimum_height    = get_sub_field( 'minimum_height' );
							$bg_select         = get_sub_field( 'background_select_columns' );
							$vertically_center = get_sub_field( 'vertically_center' );

                            $class='';

							if ( $has_background_image ) {
								$class .= ' with-bg-image';
							}
							if ( ! $show_on_mobile ) {
								$class .= ' d-none d-md-block';
							}
							?>
                            <div class="column <?php echo esc_attr( $class ); ?> <?php echo esc_attr( $size ); ?> <?php echo esc_attr( $mobile_order ); ?> <?php echo ( $vertically_center ) ? 'd-flex flex-column justify-content-center' : ''; ?>"
                                 style="color:<?php echo esc_attr( $font_color ); ?>;<?php echo ( $minimum_height && $minimum_height !== 0 ) ? 'min-height:' . esc_attr( $minimum_height ) . 'px;' : ''; ?>">
								<?php if ( $has_background_image ) : ?>
                                    <div class="background-image-holder "
                                         style="<?php echo ( $has_overlay ) ? gs_background_markup( $content_overlay, $content_overlay_opacity / 100 ) : ''; ?>">
										<?php echo wp_get_attachment_image( $bg_image['ID'], 'full', false, array( 'class' => 'responsive-background-image' ) ); ?>
                                    </div>
                                <?php else: ?>
                                <div class="background-color-holder <?php echo esc_attr($bg_select); ?>"></div>
								<?php endif; ?>
								<?php if ( $content ): ?>
									<?php echo do_shortcode( wpautop( wp_kses_post( $content ) ) ); ?>
								<?php endif; ?>

                            </div><!-- column -->
							<?php ++ $col; ?>
						<?php endwhile; ?>
                    </div><!-- row -->
                </div><!-- container -->
			<?php endif; ?>
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
<?php

$id = get_sub_field( 'id' );

$classes = get_sub_field( 'additional_classes' );

if ( $classes ) {
	$classes .= $classes . ' banner banner-testimonials not-loaded';
} else {
	$classes = 'banner banner-testimonials not-loaded';
}

$attributes = '';
if ( $id ) {
	$attributes .= ' id="' . esc_attr( $id ) . '" ';
}

$attributes .= ' class="' . esc_attr( $classes ) . '"';

$bg_images = get_sub_field( 'background_images' );

$row       = 0;

if ( $bg_images ) {
	$count = count( $bg_images );
}

// incase a page has more than one testimonial sections

global $gs_testimonials;
if ( isset( $gs_testimonials ) ) {
	++ $gs_testimonials;
} else {
	$gs_testimonials = 0;
}

add_filter( 'wp_get_attachment_image_attributes', 'gs_image_markup_responsive_background', 10, 2 );
?>

    <section <?php echo $attributes; ?>>

		<?php if ( have_rows( 'testimonials' ) ):

			?>

			<?php while ( have_rows( 'testimonials' ) ) : the_row();


			$name    = get_sub_field( 'name' );
			$company = get_sub_field( 'company' );
			$quote   = get_sub_field( 'quote', false );

			?>
            <div class="testimonial-row d-flex align-items-center" id="<?php echo 'testimonial-' . esc_attr($gs_testimonials) . esc_attr($row); ?>">
				<?php if ( $bg_images ): ?>
                    <div class="background-image-holder">
						<?php echo wp_get_attachment_image( $bg_images[ $row % $count ]['ID'], 'full', false, array( 'class' => 'responsive-background-image' ) ); ?>
                    </div>
				<?php endif; ?>
                <div class="wrap">
                    <h3><?php echo wp_kses_post( $name ); ?></h3>
                    <div class="testimonial-company">
						<?php echo wp_kses_post( $company ); ?>
                    </div>
                    <div class="testimonial-quote">
                        "<?php echo wp_kses_post( $quote ); ?>"
                    </div>
                </div><!-- wrap -->

            </div>
			<?php ++ $row; ?>
		<?php endwhile; ?>
            </div><!-- container -->

		<?php endif; ?>


    </section>

<?php
remove_filter( 'wp_get_attachment_image_attributes', 'gs_image_markup_responsive_background', 10, 2 );
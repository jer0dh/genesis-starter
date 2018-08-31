<?php

$id = get_sub_field( 'id' );

$classes = get_sub_field( 'additional_classes' );

if ( $classes ) {
	$classes .= $classes . ' banner banner-team not-loaded';
} else {
	$classes = 'banner banner-team not-loaded';
}

$attributes = '';
if ( $id ) {
	$attributes .= ' id="' . esc_attr( $id ) . '" ';
}

$attributes .= ' class="' . esc_attr( $classes ) . '"';


?>

    <section <?php echo $attributes; ?>>
        <div class="wrap">
			<?php if ( have_rows( 'members' ) ): ?>

                <div class="container">

					<?php while ( have_rows( 'members' ) ) : the_row();


						$icon_svg    = get_sub_field( 'icon_svg' );
						$icon_png    = get_sub_field( 'icon_png' );
						$name        = get_sub_field( 'name' );
						$description = get_sub_field( 'description' );

						?>
                        <div class="row">
                            <div class="col-md-3 order-md-0 order-2">
								<?php gs_echo_team_social(); ?>
                            </div>
                            <div class="col-md-9 order-0 order-md-1">
                                <h3><?php echo wp_kses_post( $name ); ?></h3>
                                <div class="team-description">
									<?php echo wp_kses_post( $description ); ?>
                                </div>

                            </div>

                        </div><!-- row -->
					<?php endwhile; ?>
                </div><!-- container -->

			<?php endif; ?>

        </div><!-- wrap -->


    </section>

<?php

function gs_echo_team_social() {
	if ( have_rows( 'social_media' ) ): ?>
        <div class="ssp-social d-flex align-items-stretch justify-content-end justify-content-md-start">
			<?php while ( have_rows( 'social_media' ) ) : the_row();
				$icon_svg = get_sub_field( 'icon_svg' );
				$icon_png = get_sub_field( 'icon_png' );
				$name     = get_sub_field( 'name' );
				$url      = get_sub_field( 'url' ); ?>

                <a href="<?php echo esc_url( $url ); ?>"><?php echo gs_svg_img_markup( $icon_svg, $icon_png, array( 'alt' => $name ) ); ?></a>

			<?php endwhile; ?>
        </div>
	<?php endif;
}
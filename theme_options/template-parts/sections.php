<?php

if ( have_rows( 'sections' ) ) {
	while ( have_rows( 'sections' ) ) {
		the_row();

		get_template_part( 'template-parts/section-' . get_row_layout() );
	}
}
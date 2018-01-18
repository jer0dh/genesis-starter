<?php

/**
 * This is for adding slideout.js for a menu from the side.
 *
 *
 *
 */


//Adds a div for the sidebar right after body

add_action( 'genesis_before', 'gs_add_side_content' );

function gs_add_side_content() {
	?>
	<div class="site-sidebar">
	</div>
	<?php

}
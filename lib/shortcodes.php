<?php

namespace Strapress\Shortcodes;

/**
 * -----------------------------------------------
 * Current Year
 * ----------------------------------------------
 *
 * Return the current year, for use in the copyright footer
 *
 */
function current_year()
{
	return date('Y');
}
add_shortcode('current_year', __NAMESPACE__.'\\current_year');


/**
 * -----------------------------------------------
 * Copyright Symbol
 * ----------------------------------------------
 *
 * Return the copyright symbol, for use in the copyright footer
 *
 */
function copyright()
{
	return '&copy;';
}
add_shortcode('copyright', __NAMESPACE__.'\\copyright');
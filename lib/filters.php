<?php

namespace Strapress\Filters;


/**
 * -----------------------------------------------
 * WordPress Title
 * ----------------------------------------------
 *
 * @param string $title The original title.
 * @return string The title to use.
 */

function wp_title( $title )
{
	if ( empty( $title ) && ( is_home() || is_front_page() ) )
	{
		$title = get_bloginfo( 'name' );
	}
	
	return $title;
}
add_filter( 'wp_title', __NAMESPACE__ . '\\wp_title' );


/**
 * -----------------------------------------------
 * Bootstrap responsive image
 * -----------------------------------------------
 *
 * Add the bootstrap helper class to all WordPress images
 *
 * @param string $class list of css classes
 * @return string list of css classes
 */

function add_bootstrap_img_responsive_class($class)
{
	$class .= ' img-fluid ';
	return $class;
}
add_filter('get_image_tag_class',  __NAMESPACE__ . '\\add_bootstrap_img_responsive_class' );


/**
 * -----------------------------------------------
 * Filter image attributes
 * -----------------------------------------------
 *
 * Filter images loaded via the wp_get_attachment_image function
 *
 * @param array $attr Image attributes
 * @return array Image attributes
 */

function filter_wp_attributes($attr)
{
	if(!isset($attr['class'])) $attr['class'] = '';

	$attr['class'] = add_bootstrap_img_responsive_class($attr['class']);

	return $attr;
}
add_filter('wp_get_attachment_image_attributes',  __NAMESPACE__ . '\\filter_wp_attributes' );

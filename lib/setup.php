<?php

namespace Strapress\Setup;

/**
 * ----------------------------------------------
 * Add Theme Support
 * ----------------------------------------------
 *
 * Add theme feature support
 */

function theme_support()
{
	add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', __NAMESPACE__ . '\\theme_support');


/**
 * ----------------------------------------------
 * Clean up wp_head
 * ----------------------------------------------
 *
 * This will remove some unnecessary markup added
 * to the wp_head by WordPress.
 */

function clean_up_wp_head()
{
	// Remove Windows Live Writter
	remove_action('wp_head', 'wlwmanifest_link');
	remove_action('wp_head', 'rsd_link');

	// Remove WP Generator
	remove_action('wp_head', 'wp_generator');

	// Remove WordPrese Emojis
	remove_action('wp_head', 'print_emoji_detection_script', 7);
	remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('after_setup_theme', __NAMESPACE__ . '\\clean_up_wp_head');


/**
 * ----------------------------------------------
 * Theme Assets
 * ----------------------------------------------
 *
 * Load the default theme assets (CSS/JS)
 */

function load_assets()
{
	// Get theme information
	$theme = wp_get_theme();

	// CSS
	wp_register_style( $theme->get_template(), get_asset_url('/css/style.css'), null, $theme->version );
	wp_enqueue_style( $theme->get_template() );

	// JS
	wp_register_script( $theme->get_template(), get_asset_url('/js/app.js'), ['jquery'], $theme->version);
	wp_enqueue_script( $theme->get_template() );
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\load_assets');


/**
 * ----------------------------------------------
 * Get Asset URL
 * ----------------------------------------------
 *
 * Find the URL to the Asset including the Laravel Mix version number
 *
 * @param string $asset_path
 * @param boolean $enable_version_ids
 * @return string Asset URL
 */

function get_asset_url($asset_path, $enable_version_ids = true)
{
	if($enable_version_ids && get_template_directory() . '/dist/mix-manifest.json') {
		$json = json_decode(file_get_contents(get_template_directory() . '/dist/mix-manifest.json'));
		$asset_path = (property_exists($json, $asset_path)) ? $json->$asset_path : $asset_path;
	}

	return get_template_directory_uri() . '/dist/' . $asset_path;
}

/**
 * ----------------------------------------------
 * Menus
 * ----------------------------------------------
 *
 * Register menus for the theme
 */

function register_menus()
{
	register_nav_menus(array(
		'main_menu' => 'Main site menu',
		'footer_menu' => 'Footer menu',
		'legal_menu' => 'Legal menu',
	));
}
add_action('init', __NAMESPACE__.'\\register_menus');


/**
 * ----------------------------------------------
 * Options Page
 * ----------------------------------------------
 *
 * Register a theme options page using ACF
 */

function register_options_page()
{
	if(function_exists('acf_add_options_page')) {

		acf_add_options_page(array(
			'page_title' => 'Site Options',
			'menu_title' => 'Site Options',
			'menu_slug'  => 'theme-general-settings',
			'capability' => 'edit_posts',
			'redirect'   => false
		));

	}
}
add_action('init', __NAMESPACE__ . '\\register_options_page');
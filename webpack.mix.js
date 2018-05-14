let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.setPublicPath('dist/');

if (!mix.inProduction()) {
	mix.webpackConfig({
		devtool: 'source-map'
	})
	.sourceMaps()
}

mix.js('src/js/app.js', 'dist/js/')
	.sass('src/sass/style.scss', 'dist/css/')
	.version();

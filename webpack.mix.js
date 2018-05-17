const mix = require('laravel-mix');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');

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

mix.options({
	processCssUrls: false
});

if (!mix.inProduction()) {
	mix.sourceMaps();
}

mix.webpackConfig({
	devtool: 'source-map',
	plugins: [
		new CopyWebpackPlugin([{
			from: 'src/images',
			to: 'images',
		}]),
		new ImageminPlugin({
			test: /\.(jpe?g|png|gif|svg)$/i,
			plugins: [
				imageminMozjpeg({
					quality: 80,
				})
			]
		})
	]
});

mix.js('src/js/app.js', 'dist/js/')
	.sass('src/sass/style.scss', 'dist/css/')
	.version()
	.browserSync('angelman.local');

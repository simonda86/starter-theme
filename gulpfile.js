'use strict';

var gulp         = require('gulp');
var gutil        = require('gulp-util');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var fileinclude  = require('gulp-file-include');
var notify       = require("gulp-notify");
var imagemin     = require('gulp-imagemin');
var del          = require('del');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rev          = require('gulp-rev');
var clean        = require('gulp-clean');
var path         = require('path');
var browserSync  = require('browser-sync').create();

// Config
var config = {
	src: './src/',
	build: './dist/',
	production: !!gutil.env.production,
	patterns: {
		'sass': 'sass/**/*.scss',
		'scripts': 'js/**/*.js',
		'images': 'images/**/*.{gif,jpg,jpeg,png,svg,ico}',
		'static': '**/*.{eot,ttf,woff,woff2,mp4}',
		'html': '**/[^_]*.html'
	},
	scripts: [
		'./node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
		'./src/js/nano.js',
		'./src/js/app.js',
	]
};

// BrowserSync
gulp.task('browser-sync', function() {

	browserSync.init([
		'**/*.php',
		'**/*.twig'
	], {
		proxy: 'http://wordpress.localhost',
		notify: false,
		online: true
	});

});

gulp.task('clean-sass', function(){
	return gulp.src(config.build + 'css').pipe(clean());
});

gulp.task('sass', ['clean-rev', 'clean-sass'], function () {
	return gulp.src(config.src + config.patterns.sass)
	.pipe(config.production ? gutil.noop() : sourcemaps.init())
	.pipe(sass({outputStyle: config.production ? 'compressed' : 'expanded'}).on('error', sass.logError))
	.pipe(config.production ? gutil.noop() : sourcemaps.write())
	.pipe(autoprefixer())
	.pipe(gulp.dest(config.build + 'css/'))
	.pipe(browserSync.stream())
	.pipe(config.production ? gutil.noop() : notify("Sass succesfully compiled"));
});

gulp.task('clean-scripts', function(){
	return gulp.src(config.build + 'js').pipe(clean());
});

gulp.task('scripts', ['clean-rev', 'clean-scripts'], function(){
	return gulp.src(config.scripts)
	.pipe(config.production ? uglify() : gutil.noop())
	.pipe(concat('theme.js'))
	.pipe(gulp.dest(config.build + 'js/'))
	.pipe(browserSync.stream())
	.pipe(config.production ? gutil.noop() : notify("Scripts succesfully compiled"));
});

gulp.task('html', function() {
	return gulp.src([config.src + config.patterns.html])
	.pipe(fileinclude())
	.pipe(gulp.dest(config.build))
	.pipe(browserSync.stream())
	.pipe(config.production ? gutil.noop() : notify("HTML succesfully compiled"));
});

gulp.task('clean-images', function(){
	return gulp.src(config.build + 'images').pipe(clean());
});

gulp.task('images', ['clean-rev', 'clean-images'], function() {
	return gulp.src(config.src + config.patterns.images)
	.pipe(imagemin({
		progressive: true,
		interlaced: true,
		verbose: true,
		svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
	}))
	.pipe(gulp.dest(config.build + 'images'));
});

gulp.task('static', function(){
	return gulp.src(config.src + config.patterns.static)
	.pipe(gulp.dest(config.build))
	.pipe(browserSync.stream())
	.pipe(config.production ? gutil.noop() : notify("Static files succesfully copied"));
});

gulp.task('watch', ['browser-sync'], function () {
	gulp.watch( config.src + config.patterns.sass, ['sass']);
	gulp.watch( config.src + config.patterns.scripts, ['scripts']);
	gulp.watch( config.src + config.patterns.images, ['images']);
	gulp.watch( config.src + config.patterns.static, ['static']);
});

gulp.task('clean-rev', function(){
	return gulp.src(config.build + 'rev-manifest.json').pipe(clean());
});

gulp.task('clean', ['clean-rev', 'clean-sass', 'clean-scripts', 'clean-images']);

gulp.task('rev', ['clean', 'default'], function(){
	return gulp.src([config.build + '/css/*.css', config.build + '/js/*.js'], {'base': path.join(process.cwd(), 'public')})
		.pipe(rev())
		.pipe(gulp.dest(config.build))
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.build));
});

gulp.task('build', ['clean', 'default', 'rev']);
gulp.task('default', ['sass', 'scripts', 'static', 'images']);
gulp.task('dev', ['default', 'watch']);
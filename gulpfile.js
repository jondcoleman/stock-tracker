var gulp = require('gulp');
var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require('vinyl-source-stream');
// var gutil = require('gulp-util');

// Lets bring es6 to es5 with this.
// Babel - converts ES6 code to ES5 - however it doesn't handle imports.
// Browserify - crawls your code for dependencies and packages them up
// into one file. can have plugins.
// Babelify - a babel plugin for browserify, to make browserify
// handle es6 including imports.
gulp.task('es6', function() {
	browserify({ debug: false })
		.transform(babelify)
		.require("./src/app.js", { entry: true })
		.bundle()
		// .on('error',gutil.log)
		.pipe(source('app.js'))
    	.pipe(gulp.dest('./dist'));
});

gulp.task('watch',function() {
	gulp.watch(['./src/*.js'],['es6'])
});

gulp.task('default', ['watch','es6']);

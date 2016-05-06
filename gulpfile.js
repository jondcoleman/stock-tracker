const gulp = require('gulp')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')

gulp.task('es6', () => {
  browserify({ debug: false })
    .transform(babelify)
    .require('./src/app.js', { entry: true })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch', () => {
  gulp.watch(['./src/*.js'], ['es6'])
})

gulp.task('default', ['watch', 'es6'])

var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')

gulp.task('build', function () {
  browserify({
    entries: './src/js/main.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('bundle.min.js'))
  .pipe(gulp.dest('./public/js'))
});

gulp.task('default', ['build'])

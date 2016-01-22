//Gulp.js configuration file

// include gulp and plugins
var
  gulp = require('gulp'),
  del = require('del');

// file locations
var
  source = 'dev/',
  dest = 'dist/';

// clean the build folder
gulp.task('clean',function() {
  del([
    dest + '*'
  ]);
});

// default task
gulp.task('default', function() {

});

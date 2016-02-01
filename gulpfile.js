//Gulp.js configuration file

// include gulp and plugins
var
  gulp = require('gulp'),
  del = require('del'),
  pleeease = require('gulp-pleeease'),
  htmlclean = require('gulp-htmlclean'),
  newer = require('gulp-newer'),
  pkg = require('./package.json'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  size = require('gulp-size');


//environment variable check
// setting Node environment variable to either development or production to control the output files
// development are readable and production files are minified and otherwise processed
var
devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),



// file locations

  source = 'dev/',
  dest = 'dist/';
  console.log('devBuild = ', devBuild);

html = {
  in: source + '*.html',
  watch: [source + '*.html'],
  out: dest,
    context: {
      devBuild: devBuild
  }
};

readme = {
  in: source + 'README.md',
  out: dest
};

css = {
  in: source + 'css/**/*',
  watch: [source + 'css/**/*'],
  out: dest +'css/',
  pleeeaseOpts: {
    "autoprefixer": {browsers: ['last 2 versions', '> 2%'] },
    "rem": ['16px'],
    "pseudoElements": true,
    "mqpacker": true,
    "minifier": !devBuild
  }
  };

js = {
  in: source + 'js/**/*',
  watch: [source + 'js/**/*'],
  out: dest +'js/',
  filename: 'main.js'
  };


//show build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production')+' build');
// clean the build folder
gulp.task('clean',function() {
  del([
    dest + '*'
  ]);
});

//build HTML
gulp.task('html', function() {
  var page = gulp.src(html.in);
  if(!devBuild){
    page = page
    .pipe(size({title: 'HTML in'}))
    .pipe(htmlclean())
    .pipe(size({title: 'HTML out'}));
  }
  return page.pipe(gulp.dest(html.out));
});
// add the README.md to the output
gulp.task('readme', function() {
  return gulp.src(readme.in)
  .pipe(gulp.dest('.'))
  .pipe(gulp.dest(readme.out));
});


// build css

gulp.task('css', function() {
  return gulp.src(css.in)
  .pipe(size({title: 'CSS in'}))
  .pipe(pleeease(css.pleeeaseOpts))
  .pipe(size({title: 'CSS out'}))
  .pipe(gulp.dest(css.out));
});

// build js

gulp.task('js', function() {
  if(devBuild){
  return gulp.src(js.in)
  .pipe(newer(js.out))
  .pipe(gulp.dest(js.out));
}
  else {
    del([
      dest + 'js/*'
    ]);
    return gulp.src(js.in)
    .pipe(size({title: 'JS in'}))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(size({title: 'JS out'}))
    .pipe(gulp.dest(js.out));
  }
});

// default task
gulp.task('default', ['html', 'css', 'js', 'readme'], function() {
// html changes
gulp.watch(html.watch, ['html']);
gulp.watch(css.watch, ['css']);
gulp.watch(js.in, ['js']);
});

// load the plugins
var gulp      = require('gulp');
var less      = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename    = require('gulp-rename');
var jshint    = require('gulp-jshint');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon    = require('gulp-nodemon');
var stylish = require('jshint-stylish');

// define a task called css
gulp.task('css', function() {
  // grab the less file, process the LESS, save to style.css
  return gulp.src('public/assets/css/style.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/css'));
});

// define a task for linting just server-side js files using the node option
// using node:true suppresses warnings that do not apply to node/express js
gulp.task('jssvr', function() {
  return gulp.src(['server.js'])
    .pipe(jshint({node: true}))
    .pipe(jshint.reporter(stylish));
});

// define a task for linting client-side js files using browser option
// using browser: true suppresses warnings that do not apply in the browser
gulp.task('jsclient', function() {
  return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
    .pipe(jshint({browser: true}))
    .pipe(jshint.reporter(stylish));
});


// task for linting all js files by calling both server and client lint js tasks
gulp.task('js', ['jsvr', 'jsclient']);

// task to lint, minify, and concat frontend files
gulp.task('scripts', function() {
  return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});

// task to lint, minify, and concat frontend angular files
gulp.task('angular', function() {
  return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('watch', function() {
  // watch the less file and run the css task
  gulp.watch('public/assets/css/style.less', ['css']);

  // watch js files and run lint and run js and angular tasks
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], ['js', 'angular']);
});

// nodemon restarts app after any change to file types in the ext: element
// nodemon will call the tasks in the tasks: array on every restart
gulp.task('nodemon', function() {
  nodemon({
    script: './bin/www',
    ext: 'js less html',
    tasks: ['js','angular','styles']
  });
});

gulp.task('default', ['nodemon']);

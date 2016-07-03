
/*
// require
*/

// gulp
var gulp = require('gulp');

var eslint = require('gulp-eslint');

// remove files
var del = require('del');

// run npm script
var exec = require('child_process').exec;

// use if sentence
var gulpif = require("gulp-if"); // use if on gulp

// babel
var babel = require('gulp-babel'); // transpile into es 5
var plumber = require('gulp-plumber'); // avoid error

// uglify
var uglify = require("gulp-uglify");

// postcss
var postcss = require('gulp-postcss');
var customProperties = require("postcss-custom-properties");
var nested = require('postcss-nested');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var postcssImport = require("postcss-import");

// webserver
var webserver = require('gulp-webserver');

// webpack
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js'); // for using external config file

// allow to use external gulp config file
var gulpConfig = require('./gulp.config.js');

// static page generator
var metalsmith = require('gulp-metalsmith');
var metalsmithLayout = require('metalsmith-layouts'); // use option
var metalsmithInplace = require('metalsmith-in-place'); // use partial & yaml front matter



/*
/  each tasks
*/

// remove files
gulp.task('clean', function () {
  del('build/**');
});

// static page generator
gulp.task('metalsmith', function () {
  return gulp.src('src/html/html/**/*.html')
    .pipe(metalsmith({

      // // Metalsmith's root directory, for example for locating templates, defaults to CWD
      // root: __dirname,
      // // Files to exclude from the build
      // ignore: ['src/*.tmp'],
      // // Initial Metalsmith metadata, defaults to {}
      // metadata: {
      //   site_title: 'Sample static site'
      // },
      // // List of JSON files that contain page definitions
      // // true means "all JSON files", see the section below
      // json: ['src/pages.json']

      frontmatter: true,
      use: [
        metalsmithLayout({
          engine: 'handlebars',
          "directory": "./src/html/layout",
          "partials": "./src/html/partial",
          "default": "default.html",
        // }),
        // metalsmithPartial({
        //   'directory': './src/html/partial'
        // }),
        // metalsmithTemplates({
        //   'engine': 'eco',
        //   'inPlace': true
        }),
        metalsmithInplace({
          "engine": "handlebars"
        })
      ]
    }))
    .pipe(gulp.dest('./dest'));
});

// eslint
gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

// css
gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 2 version']}),
    cssnano(),
    customProperties(),
    postcssImport(),
    nested()
  ];
  return gulp.src('./src/css/*.css')
  // return gulp.src('./src/css/**/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest/css'));
});

// webpack
gulp.task('webpack', function () {
  gulp.src(['./src/js/**/*.js'])
    .pipe(webpack(webpackConfig)) // load config
    .pipe(plumber()) // avoid error
    .pipe(babel()) // babelify
    .pipe(gulpif(gulpConfig.js.uglify, uglify())) // uglify
    .pipe(gulp.dest('./dest')); // build
});

// connect
gulp.task('connect', function() {
  connect.server({
    root: [__dirname]
  });
});

// webserver
gulp.task('webserver', function() { // dest を監視して変更があったら reload
  gulp.src('./dest')
    .pipe(webserver({
      livereload: true,
      port: 8000,
      fallback: 'index.html',
      open: true
    }));
});

// watch
gulp.task('watch', function() { // src を監視
  gulp.watch('./src/js/**/*.js', ['webpack']);
  gulp.watch('./src/css/**/*.css', ['css']);
  gulp.watch('./src/html/**/*.html', ['metalsmith']);
});





/*
/ declare multiple tasks
*/

gulp.task('default', ['webpack', 'watch', 'webserver']);
// gulp.task('default', ['webpack', 'watch', 'webserver', 'lint']);





/*
/ # bootstrap sass
/
/ run it only 1st times
/
/ ```zsh
/ % gulp sass
/ ```
/
*/

// sass for build bootstrap
var sass = require('gulp-sass');

// to build bootstrap sass on ./node_modules/bootstrap/sass
gulp.task('sass', function () {
  return gulp.src('./node_modules/bootstrap/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./node_modules/bootstrap/css'));
});

// watch bootstrap sass
gulp.task('sass:watch', function () {
  gulp.watch('./node_modules/bootstrap/scss/**/*.scss', ['sass']);
});

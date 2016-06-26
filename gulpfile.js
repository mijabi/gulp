var gulp = require('gulp');

var del = require('del');

var exec = require('child_process').exec;

var gulpif = require("gulp-if"); // use if on gulp

var babel = require('gulp-babel'); // transpile into es 5
var plumber = require('gulp-plumber'); // avoid error

var uglify = require("gulp-uglify");

var postcss = require('gulp-postcss');
var customProperties = require("postcss-custom-properties");
var nested = require('postcss-nested');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var postcssImport = require("postcss-import");
// var csswring = require('csswring');


// var webpack = require('webpack-stream');

// var connect = require('gulp-connect');
var webserver = require('gulp-webserver');

var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

var gulpConfig = require('./gulp.config.js');
// var webpackConfig = require('./webpack.config.js');



// var gulpsmith = require('gulpsmith');
var metalsmith = require('gulp-metalsmith');
var metalsmithLayout = require('metalsmith-layouts'); // use option
var metalsmithInplace = require('metalsmith-in-place'); // use partial & yaml front matter


gulp.task('clean', function () {
  del('build/**');
});

// gulp.task('default', function(){
//   var processors = [nested];
//   return gulp.src('in.css')
//     .pipe(postcss(processors, {}))
//     .pipe(gulp.dest('out'));
// });



// gulp.task('metalsmith', function() {
//   return gulp.src('./src/html/**/*.html').pipe(metalsmith({
//   // Metalsmith's root directory, for example for locating templates, defaults to CWD
//     root: 'src/html',
//     // Files to exclude from the build
//     // ignore: ['src/*.tmp'],
//     // Parsing frontmatter, defaults to true
//     frontmatter: true,
//     // Metalsmith plugins to use:
//     use: [
//       metalsmithLayout({
//         engine: 'handlebars'
//       })
//     ],
//     // Initial Metalsmith metadata, defaults to {}
//     metadata: {
//       site_title: 'Sample static site'
//     }
//     // List of JSON files that contain page definitions
//     // true means "all JSON files", see the section below
//     // json: ['src/pages.json']
//   }));
// });

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


// gulp.task('build:metalsmith', function() {
//   exec('metalsmith', function (err, stdout, stderr) {
//     console.log(stdout);
//     console.log(stderr);
//     cb(err);
//   });
//   // exec('node metalsmith.js', function (err, stdout, stderr) {
//   //   console.log(stdout);
//   //   console.log(stderr);
//   //   cb(err);
//   // });
// });

// gulp.task('gulpsmith', function () {
//   gulp.src(["./src/**/*.html"])
// // .pipe(some_gulp_plugin(some_options))
//   .pipe(
//     gulpsmith()     // defaults to process.cwd() if no dir supplied
//
//     // You can initialize the metalsmith instance with metadata
//     .metadata({site_name: "My Site"})
//     .use(layouts('handlebars'))
//
//     // and .use() as many Metalsmith plugins as you like
//     // .use(markdown())
//     .use(permalinks('posts/:title'))
//     .use(gulpsmith
//         .pipe(some_gulp_plugin(some_options))
//         .pipe(another_gulp_plugin(more_options))
//         .pipe(as_many_as(you_like))
//     )
//
//     "metalsmith-layouts": {
//       "engine": "handlebars",
//       "directory": "./src/html/templates",
//       "partials": "./src/html/partials",
//       "default": "default.html"
//     },
//
//   )
//   .pipe(another_gulp_plugin(more_options))
//   .pipe(gulp.dest("./build"));
// });



gulp.task('css', function () {

  var processors = [
    autoprefixer({browsers: ['last 2 version']}),
    cssnano(),
    customProperties(),
    postcssImport(),
    nested()
  ];
  return gulp.src('./src/css/**/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest/css'));

  // var postcss    = require('gulp-postcss');
  // var sourcemaps = require('gulp-sourcemaps');
  //
  // return gulp.src('./src/css/**/*.css')
  //     .pipe( sourcemaps.init() )
  //     .pipe( postcss([ require('autoprefixer'), require('precss') ]) )
  //     .pipe( sourcemaps.write('.') )
  //     .pipe( gulp.dest('./dest') );

});

gulp.task('webpack', function () {
  gulp.src(['./src/js/**/*.js'])
    .pipe(webpack(webpackConfig)) // load config
    .pipe(plumber()) // avoid error
    .pipe(babel()) // babelify
    .pipe(gulpif(gulpConfig.js.uglify, uglify())) // uglify
    .pipe(gulp.dest('./dest')); // build
});

gulp.task('connect', function() {
  connect.server({
    root: [__dirname]
  });
});

// gulp.task('webserver', function() {
//   gulp.src('app')
//     .pipe(webserver({
//       livereload: true,
//       directoryListing: true,
//       open: true
//     }));
// });

gulp.task('webserver',function(){ // dest を監視して変更があったら reload
  gulp.src('./dest')
    .pipe(webserver({
      livereload: true,
      port: 8000,
      fallback: 'index.html',
      open: true
    }));
});

gulp.task('watch', function () { // src を監視
  gulp.watch('./src/js/**/*.js', ['webpack']);
  // watch(config.js, function () {
  //   gulp.start(['webpack']);
  // });
  gulp.watch('./src/css/**/*.css', ['css']);
  gulp.watch('./src/html/html/**/*.html', ['metalsmith']);

});


gulp.task('default', ['webpack','watch','webserver']);





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

// Load Gulp...of course
const { src, dest, task, watch, series, parallel } = require("gulp");
var concat = require("gulp-concat");

// CSS related plugins
var sass = require("gulp-sass");

// JS related plugins

const minify = require('gulp-minify');


//image related plugin
var imagemin = require("gulp-imagemin");

// Utility plugins

var sourcemaps = require("gulp-sourcemaps");
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");



// Browers related plugins
var browserSync = require("browser-sync").create();


// Project related variables
var styleSRC = "./src/scss/style.scss";
var styleURL = "./dist/css/";
var mapURL = "./";
var jsURL = "./dist/js/";



var fontsSRC = "./src/fonts/**/*";
var fontsURL = "./dist/fonts/";


var htmlSRC = "./src/**/*.html";
var htmlURL = "./dist/";
var imgSrc = "./src/img/**/*";
var imgUrl = "./dist/img/";





var styleWatch = "./src/scss/**/*.scss";
var jsWatch = "./src/js/**/*.js";
var imgMinifyWatch = "./src/img/**/*.*";
var fontsWatch = "./src/fonts/**/*.*";
var htmlWatch = "./src/**/*.html";


// Tasks
function browser_sync() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function css(done) {
  src([styleSRC])
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: "compressed"
      })
    )
    .on("error", console.error.bind(console))
    .pipe(sourcemaps.write(mapURL))
    .pipe(dest(styleURL))
    .pipe(browserSync.stream());
  done();
}



function js(done) {
  src([
    "src/js/plugins/jquery.min.js",
    "src/js/plugins/bootstrap.min.js",
    "src/js/plugins/owl.carousel.min.js",
    "src/js/plugins/odometer.min.js",
    "src/js/script.js"
  ])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat("bundle.min.js"))
    .pipe(minify())
    .pipe(sourcemaps.write(mapURL))
    .pipe(dest(jsURL))
    .pipe(browserSync.stream());
  done();
}

function imgMinify(done) {
  src([imgSrc])
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(dest(imgUrl));
}

function triggerPlumber(src_file, dest_file) {
  return src(src_file)
    .pipe(plumber())
    .pipe(dest(dest_file));
}

function fonts() {
  return triggerPlumber(fontsSRC, fontsURL);
}

function html() {
  return triggerPlumber(htmlSRC, htmlURL);
}




function watch_files() {
  watch(styleWatch, series(css, reload));
  watch(jsWatch, series(js, reload));
  watch(fontsWatch, series(fonts, reload));
  watch(htmlWatch, series(html, reload));
  watch(imgMinifyWatch, series(imgMinify, reload));
  src(jsURL + "script.js").pipe(
    notify({ message: "Gulp is Watching, Happy Coding!" })
  );
}

task("css", css);
task("js", js);
task("fonts", fonts);
task("html", html);
task("imgMinify", imgMinify);
task("default", parallel(css, js,imgMinify, fonts, html));


task("watch", parallel(browser_sync, watch_files));

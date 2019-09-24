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
var styleURL = "./public/css/";
var mapURL = "./";
var jsPluginSRC = "./src/js/plugins/**/*.js";
var jsURL = "./public/js/";



var fontsSRC = "./src/fonts/**/*";
var fontsURL = "./public/fonts/";


var htmlSRC = "./src/**/*.html";
var htmlURL = "./public/";
var imgSrc = "./src/img/**/*";
var imgUrl = "./public/img/";





var styleWatch = "./src/scss/**/*.scss";
var cssCopyWatch = "./src/scss/mapbox/**/*.scss";
var jsWatch = "./src/js/**/*.js";
var imgWatch = "./src/images/**/*.*";
var fontsWatch = "./src/fonts/**/*.*";
var htmlWatch = "./src/**/*.html";
var jspluginWatch = "./src/js/**/*.js";
var customJsWatch = "./src/js/script.js";

// Tasks
function browser_sync() {
  browserSync.init({
    server: {
      baseDir: "./public/"
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
    "src/js/plugins/bootstrap.min.js" 
  ])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat("bundle.min.js"))
    .pipe(minify())
    .pipe(sourcemaps.write(mapURL))
    .pipe(dest(jsURL))
    .pipe(browserSync.stream());
  done();
}

function customJs(done) {
  src("src/js/script.js")
    .pipe(minify())
    .pipe(dest(jsURL))
    .pipe(browserSync.stream());
  done();
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
function jsCopy() {
  return triggerPlumber(jsPluginSRC, jsURL);
}
function img() {
  return triggerPlumber(imgSrc, imgUrl);
}



function watch_files() {
  watch(styleWatch, series(css, reload));
  watch(jsWatch, series(js, reload));
  watch(imgWatch, series(img, reload));
  watch(fontsWatch, series(fonts, reload));
  watch(htmlWatch, series(html, reload));
  watch(jspluginWatch, series(jsCopy, reload));
  watch(customJsWatch, series(customJs, reload));
  src(jsURL + "script.js").pipe(
    notify({ message: "Gulp is Watching, Happy Coding!" })
  );
}

task("css", css);
task("js", js);
task("fonts", fonts);
task("html", html);
task("jsCopy", jsCopy);
task("customJs", customJs);
task("img", img);
task("default", parallel(css, js, jsCopy,customJs, img, fonts, html));


task("watch", parallel(browser_sync, watch_files));

// Load Gulp...of course
const del = require("delete");
const { src, dest, task, watch, series, parallel } = require("gulp");
let concat = require("gulp-concat");

// CSS related plugins
let sass = require("gulp-sass");

// JS related plugins

const minify = require('gulp-minify');


//image related plugin
let imagemin = require("gulp-imagemin");

// Utility plugins

let sourcemaps = require("gulp-sourcemaps");
let plumber = require("gulp-plumber");
let notify = require("gulp-notify");



// Browers related plugins
let browserSync = require("browser-sync").create();


// Project related letiables
let styleSRC = "./src/scss/style.scss";
let styleURL = "./dist/css/";
let mapURL = "./";
let jsURL = "./dist/js/";
let imgUrl = "./dist/img/";


let fontsSRC = "./src/fonts/**/*";
let fontsURL = "./dist/fonts/";


let htmlSRC = "./src/**/*.html";
let htmlURL = "./dist/";
let imgSrc = "./src/img/**/*";

let jsScript = "./src/js/script.js";

let phpSRC = "./src/**/*.php";


let styleWatch = "./src/scss/**/*.scss";
let jsWatch = "./src/js/**/*.js";
let imgMinifyWatch = "./src/img/**/*.*";
let fontsWatch = "./src/fonts/**/*.*";
let htmlWatch = "./src/**/*.html";
let phpWatch = "./src/**/*.php";

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
        // outputStyle: "compressed"
      })
    )
    .on("error", console.error.bind(console))
    // .pipe(sourcemaps.write(mapURL))
    .pipe(dest(styleURL))
    .pipe(browserSync.stream());
  done();
}



function js(done) {
  src([
    "src/js/jquery.min.js",
    "src/js/bootstrap.min.js",
    "src/js/owl.carousel.min.js",
    "src/js/odometer.min.js",
    "src/js/mapbox-gl.js"
  ])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat("bundle.min.js"))
    .pipe(minify())
    .pipe(sourcemaps.write(mapURL))
    .pipe(dest(jsURL))
    .pipe(browserSync.stream());
  done();
}

// function imgMinify(done) {
//   src([imgSrc])
//     .pipe(
//       imagemin([
//         imagemin.gifsicle({ interlaced: true }),
//         imagemin.jpegtran({ progressive: true }),
//         imagemin.optipng({ optimizationLevel: 5 }),
//         imagemin.svgo({
//           plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
//         })
//       ])
//     )
//     .pipe(dest(imgUrl));
//   done();
// }

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
function php() {
  return triggerPlumber(phpSRC, htmlURL);
}
function jsCopy() {
  return triggerPlumber(jsScript, jsURL);
}
function imgMinify() {
  return triggerPlumber(imgSrc, imgUrl);
}




function watch_files(done) {
  watch(jsWatch, series(js, reload));
  watch(styleWatch, series(css, reload));
  watch(fontsWatch, series(fonts, reload));
  watch(htmlWatch, series(html, reload));
  watch(phpWatch, series(php, reload));
  watch(imgMinifyWatch, series(imgMinify, reload));
  src(jsURL + "/bundle.min.js").pipe(
    notify({ message: "Gulp is Watching, Happy Coding!" })
  );
  done();
}

// const clean = (done) => {
//   del.sync(["./dist/"]);
//   done();
// }



// task("clean", clean);
task("css", css);
task("js", js);
task("php", php);
task("jsCopy", jsCopy);
task("fonts", fonts);
task("html", html);
task("imgMinify", imgMinify);
task("default", parallel(js, css, fonts, html,jsCopy, imgMinify,php));
task("watch", parallel(browser_sync, watch_files));

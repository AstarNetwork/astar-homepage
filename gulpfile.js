const { src, dest, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const changed = require("gulp-changed");
const imagemin = require("gulp-imagemin");
const imageminJpg = require("imagemin-jpeg-recompress");
const imageminPng = require("imagemin-pngquant");
const imageminGif = require("imagemin-gifsicle");
const rename = require("gulp-rename");
// const header = require("gulp-header");
// const footer = require("gulp-footer");
const ejs = require("gulp-ejs");
const browserSync = require("browser-sync").create();

const html = () =>
  src(["src/ejs/**/*.ejs", "!" + "src/ejs/**/_*.ejs"])
    .pipe(ejs({}, {}, { ext: ".html" }))
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("./docs"))
    .pipe(browserSync.stream());

const CSS = () =>
  src("./src/sass/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer({ grid: true }))
    .pipe(dest("./docs/css"));

const image = () =>
  src("./src/images/**/*.+(jpg|jpeg|png|gif)")
    .pipe(changed("./docs/images"))
    .pipe(
      imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
          interlaced: false,
          optimizationLevel: 3,
          colors: 180,
        }),
      ])
    )
    .pipe(dest("./docs/images"));

const watchFiles = () =>
  browserSync.init({
    server: {
      baseDir: "./docs",
    },
    open: "external",
    host: "192.168.0.22",
  });
watch("./src/sass/**/*.scss", CSS);
watch("./src/images/**/*.+(jpg|jpeg|png|gif)", image);
watch("./src/ejs/**/*.ejs", html);
watch("./docs/**/*").on("change", browserSync.reload);

exports.html = html;
exports.CSS = CSS;
exports.image = image;
exports.watchFiles = watchFiles;
exports.default = parallel(html, CSS, image, watchFiles);

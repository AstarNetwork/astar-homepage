import pkg from "gulp";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from "gulp-autoprefixer";
import changed from "gulp-changed";
import imagemin from "gulp-imagemin";
import imageminJpg from "imagemin-jpeg-recompress";
import imageminPng from "imagemin-pngquant";
import imageminGif from "imagemin-gifsicle";
import rename from "gulp-rename";
// const header = require("gulp-header");
// const footer = require("gulp-footer");
import ejs from "gulp-ejs";
import browserSync from "browser-sync";

const sass = gulpSass(dartSass);
const { src, dest, parallel, watch } = pkg;

const html = () =>
  src(["src/ejs/**/*.ejs", "!" + "src/ejs/**/_*.ejs"])
    .pipe(ejs({}, {}, { ext: ".html" }))
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("./docs"))
    .pipe(browserSync.create().stream());

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
      routes: {
        '/builders-program': './docs/spacelabs/index.html'
      }
    },
    // open: "external",
    // host: "192.168.0.22",
  });
watch("./src/sass/**/*.scss", CSS);
watch("./src/images/**/*.+(jpg|jpeg|png|gif)", image);
watch("./src/ejs/**/*.ejs", html);
watch("./docs/**/*").on("change", browserSync.reload);

// exports.html = html;
// exports.CSS = CSS;
// exports.image = image;
// exports.watchFiles = watchFiles;
// exports.default = parallel(html, CSS, image, watchFiles);

export { html, CSS, image, watchFiles };
export default parallel(html, CSS, image, watchFiles);

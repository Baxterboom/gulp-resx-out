const gulp = require("gulp");
const debug = require("gulp-debug");
const resxconverter = require("./index.js");
const ext_replace = require('gulp-ext-replace');

gulp.task("default", () => {

  function onwrite(result, file) {
    return `const Phrases = ${JSON.stringify(result, null, "\t")};`;
  }

  function onparse(item, result, file) {
    return item;
  }

  return gulp.src("./res/*.resx")
    .pipe(debug())
    .pipe(resxconverter({
      delimiter: '.',
      onwrite: onwrite,
      onparse: onparse
    }))
    .pipe(ext_replace(".ts"))
    .pipe(gulp.dest("./out"));
});
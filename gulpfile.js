const gulp = require("gulp");
const debug = require("gulp-debug");
const resx_out = require("./index.js");
const ext_replace = require('gulp-ext-replace');

gulp.task("default", () => {
  return gulp.src("./res/*.resx")
    .pipe(debug())
    .pipe(resx_out({
      delimiter: '.',
      onwrite: (result, file) => `const Phrases = ${JSON.stringify(result, null, "\t")};`,
      onparse: (item, result, file) => item
    }))
    .pipe(ext_replace(".ts"))
    .pipe(gulp.dest("./out"));
});
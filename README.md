gulp-resx-out
===============
Gulp plugin to allow custom formatting of resx files through callbacks.

Features
--------
- use delimiter to create a structured object.
- intercept and modify output of the resx file.
- default output json, but can be modified through callbacks.

How to install
--------------
```shell
npm install gulp-resx-out --save-dev
```

Options
-------
- `onwrite?: (obj, file) => string|obj` - Callback to change the final output. 
- `onparse?: (item, result, file) => { item: string, value: string }` - Callback to change item in the resx before its attatched to output.
- `delimiter?: string` - split character for resx name(s)

Basic Usage
----------
 
```javascript
//`gulpfile.js`
const gulp = require("gulp");
const debug = require("gulp-debug");
const resx_out = require("gulp-resx-out");
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
    .pipe(resx_out({
      delimiter: '.',
      onwrite: onwrite,
      onparse: onparse
    }))
    .pipe(ext_replace(".ts"))
    .pipe(gulp.dest("./out"));
});
```
```xml
//resx file
<?xml version="1.0" encoding="utf-8"?>
<root>
  <data name="Common.Labels.DefiniteTime">
    <value>Definite time</value>
  </data>
  <data name="Common.Labels.DefiniteTimeTooltip">
    <value>Possible to register events as start time and end time</value>
  </data>
   <data name="ActiveTime.Texts.FutureVersionExists">
    <value>There is a future version of this code. The changes you have made to this version are not included in the future version.</value>
  </data>
  <data name="ActiveTime.Texts.InCurrentVersion">
    <value>In current version</value>
  </data>
  <data name="ActiveTime.Texts.InNewVersion">
    <value>In new version</value>
  </data>
  <data name="ActiveTime.Texts.InUse">
    <value>This version is in use. Changes will affect back to the from date of the current version</value>
  </data>
  <data name="ActiveTime.Texts.IsHistoricalVersion">
    <value>This is a historical version. If you make changes here. it will mean that historical calculations will be recalculated.</value>
  </data>
</root>
```
```javascript
//Output
const Phrases = {
	"Common": {
		"Labels": {
			"DefiniteTime": "Definite time",
			"DefiniteTimeTooltip": "Possible to register events as start time and end time",
	},
	"ActiveTime": {
		"Texts": {
			"FutureVersionExists": "There is a future version of this code. The changes you have made to this version are not included in the future version.",
			"InCurrentVersion": "In current version",
			"InNewVersion": "In new version",
			"InUse": "This version is in use. Changes will affect back to the from date of the current version",
			"IsHistoricalVersion": "This is a historical version. If you make changes here. it will mean that historical calculations will be recalculated."
		}
	}
};

```

License
-------
gulp-resx-out is licensed under the [MIT license](http://opensource.org/licenses/MIT).

const log = require('fancy-log');
const Type = require('axis.js');
const libxmljs = require("libxmljs");
const through2 = require('through2');
const PluginError = require('plugin-error');

const PLUGIN_NAME = "gulp-resx-out";
const PLUGIN_OPTIONS = {
  delimiter: "",
  onwrite: (obj, file) => null,
  onparse: (item, result, file) => item,
};

module.exports = function (options) {
  options = Object.assign({}, PLUGIN_OPTIONS, options);

  function parse(item, result) {
    if (!item) return;
    let current = result;
    const parts = options.delimiter.length == 0 ? [item.name] : item.name.split(options.delimiter);
    while (parts.length) {
      const part = parts.shift();
      const target = current[part];
      if (target && target.length) {
        return log(PLUGIN_NAME + ": ignoring [" + item.name + "] since [" + part + "] already exists.");
      }
      current = target || (current[part] = parts.length == 0 ? item.value : {});
    }
  }

  function convert(file) {
    const result = {};
    const xml = file.contents;
    const doc = libxmljs.parseXml(xml);
    const root = doc.root();
    const nodes = root.find("data");
    nodes.forEach(function (element) {
      const item = {
        name: element.attr("name").value(),
        value: element.get("value").text()
      };
      parse(options.onparse(item, result, file), result);
    });

    const out = options.onwrite(result, file) || {};
    return Type.isString(out) ? out : JSON.stringify(out, null, "\t");
  };

  function throughCallback(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = new Buffer(convert(file));
    }

    this.push(file);
    return cb();
  };

  return through2.obj(throughCallback);
};
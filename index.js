const Type = require('axis.js');
const through2 = require('through2');
const { XMLParser } = require('fast-xml-parser');
const PluginError = require('plugin-error');

const PLUGIN_NAME = "gulp-resx-out";
const PLUGIN_OPTIONS = {
  delimiter: "",
  onwrite: (obj, file) => null,
  onparse: (item, result, file) => item,
};

module.exports = function (options) {
  const log = [];
  options = Object.assign({}, PLUGIN_OPTIONS, options);

  function parse(item, result) {
    if (!item) return;
    let current = result;
    const parts = options.delimiter.length == 0 ? [item.name] : item.name.split(options.delimiter);
    while (parts.length) {
      const part = parts.shift();
      const target = current[part];
      if (target && target.length) {
        log.push(PLUGIN_NAME + ": ignoring [" + item.name + "] since [" + part + "] already exists.");
      }
      current = target || (current[part] = parts.length == 0 ? item.value : {});
    }
  }

  function convert(file) {
    const result = {};
    const json = new XMLParser({
      ignoreNameSpace: false,
      ignoreAttributes: false,
      attributeNamePrefix: "@"
    });

    const nodes = json.parse(file.contents.toString()).root.data;
    nodes.forEach(function (node) {
      const item = {
        name: node["@name"],
        value: node["value"]
      };

      parse(options.onparse(item, result, file), result);
    });

    const out = options.onwrite(result, file) || {};
    return Type.isString(out) ? out : JSON.stringify(out, null, "\t");
  }

  function throughCallback(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = Buffer.from(convert(file));
    }

    this.push(file);
    log.forEach(e => console.warn(e));
    log.length = 0;
    return cb();
  };

  return through2.obj(throughCallback);
};
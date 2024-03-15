"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/rollup.ts
var rollup_exports = {};
__export(rollup_exports, {
  default: () => rollup_default
});
module.exports = __toCommonJS(rollup_exports);

// src/index.ts
var import_unplugin = require("unplugin");
var import_pluginutils = require("@rollup/pluginutils");

// src/core/index.ts
var import_utils = require("unplugin-transform-class/utils");
var strippedPrefixes = [
  "v-bind:",
  ":",
  "@",
  "v-on"
];
var templateRe = /<template>([\s\S]*)<\/template>/g;
var splitterRE = /[\s'"`;]+/g;
var elementRE = new RegExp("<\\w(?=.*>)[\\w:\\.$-]*\\s((?:\".*?\"|'.*?'|`.*?`|.*?)*?)>", "gs");
var valuedAttributeRE = /([?]|(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-\[\]#_:@.!%-]+)(?:=(["'])([^\2]*?)\2)?/g;
var validateFilterRE = /(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:%-?]/;
function isValidSelector(selector = "") {
  return validateFilterRE.test(selector);
}
var defaultAttributes = ["bg", "flex", "grid", "border", "text", "font", "class", "className", "p", "m", "animate", "color", "w", "h", "rd"];
var defaultIgnoreNonValuedAttributes = ["class", "v-else"];
function extractorAttributify(options) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const attributes = (_a = options == null ? void 0 : options.attributes) != null ? _a : defaultAttributes;
  const nonValuedAttribute = (_b = options == null ? void 0 : options.nonValuedAttribute) != null ? _b : true;
  const ignoreNonValuedAttributes = (_c = options == null ? void 0 : options.ignoreNonValuedAttributes) != null ? _c : defaultIgnoreNonValuedAttributes;
  const prefix = (_d = options == null ? void 0 : options.prefix) != null ? _d : "un-";
  const prefixedOnly = (_e = options == null ? void 0 : options.prefixedOnly) != null ? _e : false;
  const transformEscape = (_f = options == null ? void 0 : options.transformEscape) != null ? _f : true;
  const transformRules = (_g = options == null ? void 0 : options.transformRules) != null ? _g : import_utils.defaultRules;
  const classPrefix = (_h = options == null ? void 0 : options.classPrefix) != null ? _h : "";
  return function extract(code) {
    const result = [];
    const templateMatchs = Array.from(code.matchAll(templateRe));
    if (templateMatchs.length) {
      const templateCode = templateMatchs[0][1];
      Array.from(templateCode.matchAll(elementRE)).forEach(([elementStr, valuedAttributeStr]) => {
        const valuedAttributes = Array.from((valuedAttributeStr || "").matchAll(valuedAttributeRE));
        const option = {
          elementStr,
          staticClass: "",
          selectors: []
        };
        valuedAttributes.forEach(([sourceStr, name, _, content]) => {
          const _name = prefixedOnly ? name.replace(prefix, "") : name;
          if (!content) {
            if (name === "class")
              option.staticClass = sourceStr;
            if (prefixedOnly && !name.startsWith(prefix))
              return;
            if (isValidSelector(_name) && nonValuedAttribute !== false) {
              if (!ignoreNonValuedAttributes.includes(_name))
                option.selectors.push(transformEscape ? (0, import_utils.transformSelector)(`${classPrefix}${_name}`, transformRules) : `${classPrefix}${_name}`);
            }
            return;
          }
          for (const prefix2 of strippedPrefixes) {
            if (name.startsWith(prefix2)) {
              name = name.slice(prefix2.length);
              return;
            }
          }
          if (!attributes.includes(_name))
            return;
          if (["class", "className"].includes(name)) {
            option.staticClass = sourceStr;
          } else {
            if (prefixedOnly && !name.startsWith(prefix))
              return;
            const attributifyToClass = content.split(splitterRE).filter(Boolean).map((v) => {
              if (v === "~")
                return `${classPrefix}${_name}`;
              if (v.includes(":")) {
                const [pseudoPrefix, pseudoValue] = v.split(":");
                const classStr = `${pseudoPrefix}:${classPrefix}${_name}-${pseudoValue}`;
                return `${transformEscape ? (0, import_utils.transformSelector)(classStr, transformRules) : classStr}`;
              }
              return `${classPrefix}${_name}-${transformEscape ? (0, import_utils.transformSelector)(v, transformRules) : v}`;
            }).join(" ");
            option.selectors.push(attributifyToClass);
          }
        });
        result.push(option);
      });
      result.forEach(({ elementStr, staticClass, selectors }) => {
        if (selectors.length === 0)
          return;
        if (staticClass) {
          const replaceStr = elementStr.replace(staticClass, spliceStr(staticClass, -1, ` ${selectors.join(" ")}`));
          code = code.replace(elementStr, replaceStr);
        } else {
          const classStr = ` class="${selectors.join(" ")}"`;
          const insertIndex = elementStr.endsWith("/>") ? -2 : -1;
          code = code.replace(elementStr, spliceStr(elementStr, insertIndex, classStr));
        }
      });
    }
    return code;
  };
}
function spliceStr(str, start, newStr) {
  return str.slice(0, start) + newStr + str.slice(start);
}

// src/index.ts
var src_default = (0, import_unplugin.createUnplugin)((options) => {
  const extractor = extractorAttributify(options);
  const filter = (0, import_pluginutils.createFilter)(
    options.include || [/\.vue$/, /\.vue\?vue/],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
  );
  return {
    name: "unplugin-attributify-to-class",
    enforce: "pre",
    transformInclude(id) {
      return filter(id);
    },
    transform(code) {
      return extractor(code);
    }
  };
});

// src/rollup.ts
var rollup_default = src_default.rollup;
if (module.exports.default) module.exports = module.exports.default;
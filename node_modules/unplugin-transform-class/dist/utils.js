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

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  cacheRestoreSelector: () => cacheRestoreSelector,
  cacheTransformEscapESelector: () => cacheTransformEscapESelector,
  cacheTransformSelector: () => cacheTransformSelector,
  defaultRules: () => defaultRules,
  escapeRegExp: () => escapeRegExp,
  getClass: () => getClass,
  restoreSelector: () => restoreSelector,
  transformCode: () => transformCode,
  transformEscapESelector: () => transformEscapESelector,
  transformSelector: () => transformSelector
});
module.exports = __toCommonJS(utils_exports);

// src/core/index.ts
var import_utils = require("@meoc/utils");
function getClass(code) {
  const matchs = [];
  Array.from(code.matchAll(/\s:?class="([\s\S]*?)"/g)).forEach((m) => {
    const classStr = m[1];
    const sourceStr = (0, import_utils.trim)(m[0]);
    let classArr = [sourceStr];
    if (sourceStr.startsWith(":")) {
      if (classStr.startsWith("{"))
        classArr = classArr.concat(getObjClass(classStr));
      else if (classStr.startsWith("["))
        classArr = classArr.concat(getArrClass(classStr));
    } else {
      classArr.push(classStr);
    }
    matchs.push(classArr);
  });
  Array.from(code.matchAll(/className=["']([\s\S]*?)["']/g)).forEach((m) => {
    matchs.push([m[0], m[1]]);
  });
  Array.from(code.matchAll(/className=[{]([\s\S]*?)[}]/g)).forEach((m) => {
    matchs.push([m[0], ...Array.from(m[1].matchAll(/["']([\s\S]+?)["']/g)).map((v) => v[1])]);
  });
  return matchs;
}
function getObjClass(className) {
  return Array.from(className.matchAll(/'([^']+?)'\s*:/g)).map((v) => v[1]);
}
function getArrClass(className) {
  return Array.from(className.matchAll(new RegExp("(?<=[\\?\\:&])\\s*'(.*?)'", "g"))).map((v) => v[1]);
}
function transformCode(code, rules = defaultRules) {
  const classNames = getClass(code);
  classNames.forEach((c) => {
    let currentClass = c[0];
    c.slice(1).forEach((selector) => {
      currentClass = currentClass.replace(selector, cacheTransformSelector(selector, rules));
    });
    code = code.replace(c[0], currentClass);
  });
  return code;
}

// src/utils.ts
var defaultRules = {
  ".": "_dl_",
  "/": "_sl_",
  ":": "_cl_",
  "%": "_pes_",
  "!": "_el_",
  "#": "_wn_",
  "(": "_lbl_",
  ")": "_lbr_",
  "[": "_lfl_",
  "]": "_lfr_",
  "$": "_do_",
  ",": "_lco_",
  "=": "_eqe_",
  "+": "_plus_",
  "*": "_star_"
};
function escapeRegExp(str = "") {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function createTransformRegExp(rules, needEscape = false) {
  const escapePrefix = "\\";
  return new RegExp(Object.keys(rules).map((rule) => escapeRegExp(`${needEscape ? escapePrefix : ""}${rule}`)).join("|"), "g");
}
function transformSelector(selector = "", rules = defaultRules) {
  const transformRegExp = createTransformRegExp(rules);
  return selector.replaceAll(transformRegExp, (m) => {
    return rules[m];
  });
}
var cacheTransformSelector = function() {
  let transformRegExp;
  return (selector = "", rules = defaultRules) => {
    if (!transformRegExp)
      transformRegExp = createTransformRegExp(rules);
    return selector.replaceAll(transformRegExp, (m) => {
      return rules[m];
    });
  };
}();
function transformEscapESelector(selector = "", rules = defaultRules) {
  const transformRegExp = createTransformRegExp(rules, true);
  return selector.replaceAll(transformRegExp, (m) => {
    return rules[m.replace("\\", "")];
  });
}
var cacheTransformEscapESelector = function() {
  let transformRegExp;
  return (selector = "", rules = defaultRules) => {
    if (!transformRegExp)
      transformRegExp = createTransformRegExp(rules, true);
    return selector.replaceAll(transformRegExp, (m) => {
      return rules[m.replace("\\", "")];
    });
  };
}();
function restoreSelector(selector = "", rules = defaultRules) {
  const reverseRules = Object.fromEntries(Object.entries(rules).map(([key, value]) => [value, key]));
  const transformRegExp = createTransformRegExp(reverseRules);
  return selector.replaceAll(transformRegExp, (m) => {
    return reverseRules[m];
  });
}
var cacheRestoreSelector = function() {
  let transformRegExp;
  let reverseRules;
  return (selector = "", rules = defaultRules) => {
    if (!transformRegExp) {
      reverseRules = Object.fromEntries(Object.entries(rules).map(([key, value]) => [value, key]));
      transformRegExp = createTransformRegExp(reverseRules);
    }
    return selector.replaceAll(transformRegExp, (m) => {
      return reverseRules[m];
    });
  };
}();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cacheRestoreSelector,
  cacheTransformEscapESelector,
  cacheTransformSelector,
  defaultRules,
  escapeRegExp,
  getClass,
  restoreSelector,
  transformCode,
  transformEscapESelector,
  transformSelector
});
if (module.exports.default) module.exports = module.exports.default;
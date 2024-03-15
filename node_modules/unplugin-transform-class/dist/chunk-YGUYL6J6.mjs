import {
  transformCode
} from "./chunk-V7FJECQQ.mjs";

// src/index.ts
import { createUnplugin } from "unplugin";
import { createFilter } from "@rollup/pluginutils";
var src_default = createUnplugin((options = {}) => {
  const rules = options.rules;
  const filter = createFilter(
    options.include || [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
  );
  return {
    name: "unplugin-transform-class",
    enforce: "pre",
    transformInclude(id) {
      return filter(id);
    },
    transform(code) {
      return transformCode(code, rules);
    }
  };
});

export {
  src_default
};

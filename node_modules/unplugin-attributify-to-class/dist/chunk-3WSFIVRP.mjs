import {
  extractorAttributify
} from "./chunk-TFGRJXB3.mjs";

// src/index.ts
import { createUnplugin } from "unplugin";
import { createFilter } from "@rollup/pluginutils";
var src_default = createUnplugin((options) => {
  const extractor = extractorAttributify(options);
  const filter = createFilter(
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

export {
  src_default
};

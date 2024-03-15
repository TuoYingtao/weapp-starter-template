import { Options } from './types.mjs';
export { defaultAttributes, defaultIgnoreNonValuedAttributes } from './utils.mjs';
import '@rollup/pluginutils';

declare const attributifyToClass: (options?: Options) => any;

export { attributifyToClass };

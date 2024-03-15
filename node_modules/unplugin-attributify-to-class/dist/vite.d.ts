import { Options } from './types.js';
export { defaultAttributes, defaultIgnoreNonValuedAttributes } from './utils.js';
import '@rollup/pluginutils';

declare const attributifyToClass: (options?: Options) => any;

export { attributifyToClass };

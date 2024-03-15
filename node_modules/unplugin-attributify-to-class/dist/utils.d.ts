import { Options } from './types.js';
import '@rollup/pluginutils';

declare const defaultAttributes: string[];
declare const defaultIgnoreNonValuedAttributes: string[];
declare function extractorAttributify(options?: Options): any;

export { defaultAttributes, defaultIgnoreNonValuedAttributes, extractorAttributify };

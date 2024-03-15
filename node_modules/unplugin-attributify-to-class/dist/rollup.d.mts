import * as rollup from 'rollup';
import { Options } from './types.mjs';
import '@rollup/pluginutils';

declare const _default: (options: Options) => rollup.Plugin<any> | rollup.Plugin<any>[];

export { _default as default };

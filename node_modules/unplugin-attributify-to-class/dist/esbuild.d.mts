import * as esbuild from 'esbuild';
import { Options } from './types.mjs';
import '@rollup/pluginutils';

declare const _default: (options: Options) => esbuild.Plugin;

export { _default as default };

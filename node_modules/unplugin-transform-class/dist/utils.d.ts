/**
 * 获取class
 */
declare function getClass(code: string): string[][];
declare function transformCode(code: string, rules?: Record<string, string>): string;

declare const defaultRules: Record<string, string>;
declare function escapeRegExp(str?: string): string;
/**
 * 转换选择器字符
 * @param selector 选择器
 * @param rules 转换规则
 * @example bg-[#452233]:50 => bg--fl--w-452233-fr--c-40-c-50
 */
declare function transformSelector(selector?: string, rules?: Record<string, string>): string;
declare const cacheTransformSelector: (selector?: string, rules?: Record<string, string>) => string;
/**
 * 转换转义的选择器字符
 * @param selector 转义选择器
 * @param rules 转换规则
 * @example bg-\[\#452233\]\:50 => bg--fl--w-452233-fr--c-40-c-50
 */
declare function transformEscapESelector(selector?: string, rules?: Record<string, string>): string;
declare const cacheTransformEscapESelector: (selector?: string, rules?: Record<string, string>) => string;
/**
 * 还原转换后的选择器
 * @param selector 选择器
 * @param rules 转换规则
 * @example .bg--fl--w-452233-fr--c-40-c-50 => .bg-[#452233]:50
 */
declare function restoreSelector(selector?: string, rules?: Record<string, string>): string;
declare const cacheRestoreSelector: (selector?: string, rules?: Record<string, string>) => string;

export { cacheRestoreSelector, cacheTransformEscapESelector, cacheTransformSelector, defaultRules, escapeRegExp, getClass, restoreSelector, transformCode, transformEscapESelector, transformSelector };

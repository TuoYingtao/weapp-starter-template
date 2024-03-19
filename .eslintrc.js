/*
 * Eslint config file
 * Documentation: https://eslint.org/docs/user-guide/configuring/
 * Install the Eslint extension before using this feature.
 */
module.exports = {
  ignorePatterns: ['node_modules/', 'build/', 'lib.*.js'],
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  ecmaFeatures: {
    modules: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  globals: {
    wx: true,
    App: true,
    Page: true,
    getCurrentPages: true,
    getApp: true,
    Component: true,
    requirePlugin: true,
    requireMiniProgram: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier', '@unocss'],
  rules: {
    'prettier/prettier': 'error',
    'no-empty': 'off', // 空块语句
    'prefer-const': 1, // 要求使用 const 声明那些声明后不再被修改的变量
    'max-len': 0, // 强制一行的最大长度
    'guard-for-in': 0, // 要求 for-in 循环中有一个 if 语句
    'no-console': 'off', // 禁用 console
    'no-debugger': 'off', // 禁用 debugger
    'no-plusplus': 0, // 禁止使用++，--
    'no-extra-semi': 0, // 和prettier冲突
    'import/extensions': 0, // import不需要写文件扩展名
    'no-underscore-dangle': 0, // 禁止标识符中有悬空下划线
    'no-restricted-syntax': 0, // 禁用特定的语法
    'consistent-return': 'off', // 要求 return 语句要么总是指定返回的值，要么不指定
    semi: ['off', 'always'], // 要求或禁止使用分号代替 ASI
    'no-prototype-builtins': 'off', // 禁止直接调用 Object.prototypes 的内置属性
    'class-methods-use-this': 'off', // 强制类方法使用 this
    'template-curly-spacing': 'off', // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
    'linebreak-style': [0, 'error', 'windows'], // 强制使用一致的换行风格
    'arrow-parens': ['error', 'as-needed'], // 要求箭头函数的参数使用圆括号
    'no-unused-vars': 'warn', // 对已声明未使用的参数警告
    'no-unused-expressions': 'off',
    'no-param-reassign': ['off', { props: false }], // 禁止对 function 的参数进行重新赋值
  },
  plugins: ['prettier'],
};

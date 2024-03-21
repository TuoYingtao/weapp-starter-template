import { defineConfig } from 'unocss';
import presetWeapp from 'unocss-preset-weapp';
import { defaultRules, extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer';

const include = [/\.wxml$/];
const remRE = /^-?[.\d]+rem$/;
const transformRules = {
  ...defaultRules,
  '.': '-d111-',
  '/': '-s111-',
  ':': '-c111-',
  '%': '-p111-',
  '!': '-e111-',
  '#': '-w111-',
  '(': '-b111l-',
  ')': '-b111r-',
  '[': '-f111l-',
  ']': '-f111r-',
  $: '-r111-',
  ',': '-r222-'
};
const { presetWeappAttributify, transformerAttributify } = extractorAttributify({
  transformRules
});

export default defineConfig({
  content: {
    pipeline: { include }
  },
  theme: {
    // 解决小程序不支持 * 选择器
    preflightRoot: ['page,::before,::after'],
    colors: {
      page: '#f8f8f8',
      primary: '#ff5100',
      main: '#333',
      content: '#666',
      tips: '#999',
      light: '#eee',
      gradientBegin: '#ffb568',
      active: 'rgba(0,0,0,.15)',
      danger: '#FF3E3E',
      success: '#24C372',
      warning: '#FF9A00',
      grey: '#E5E5E5',
      dangerLight: '#FFECEC',
      successLight: '#E3F8ED',
      primaryLight: '#F7ECFC',
      warningLight: '#FFF8ED',
      // 项目自定义颜色
      price: '#ff5100',
      cityBg: '#ffdccc',
      cityText: '#ff5100',
      appoint: '#ff5100',
      descBg: '#fff6f2',
      descText: '#333',
      protocol: '#ff5100',
      btnTextReverse: '#fff',
      checkText: '#ff5100',
      mineHeader: '#ff5100',
      avatarText: '#ff5100',
      addText: '#ff5100'
    },
    borderRadius: {
      none: '0',
      sm: '10rpx',
      md: '20rpx',
      lg: '30rpx',
      full: '50%'
    }
  },
  rules: [
    [/^f(\d+)-(\d+)$/, ([, size, height]) => ({ 'font-size': `${size}rpx`, 'line-height': `${height}rpx` })],
    [
      /^((border|b)-?)((bottom|top|left|right)-?)?(solid|dashed)?-(\d+)-(.*)$/,
      ([, , , , direction, style, size, color], { theme }) => {
        const key = direction ? `border-${direction}` : 'border';
        const regFlag = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color);
        const hexRegFlag = /^hex-([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color);
        const borderColor = regFlag
          ? color
          : color.replace('hex-', '#')
            ? hexRegFlag
            : theme.colors[color]
              ? theme.colors[color]
              : theme.colors['grey'];
        return {
          [key]: `${size}rpx ${style || 'solid'} ${borderColor}`
        };
      }
    ],
    [
      /^nowrap(\d+)?$/,
      ([, line]) => ({
        display: '-webkit-box',
        overflow: 'hidden',
        '-webkit-box-orient': 'vertical',
        'text-overflow': 'ellipsis',
        '-webkit-line-clamp': line || 1
      })
    ]
  ],
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      transformRules
    }),
    // attributify autocomplete
    presetWeappAttributify()
  ],
  transformers: [
    // options 见https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass({
      transformRules
    }),
    // options 见https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify()
  ],
  shortcuts: [
    {
      'wh-full': 'w-100% h-100%',
      'flex-center': 'flex items-center justify-center',
      'flex-center-between': 'flex items-center justify-between',
      'bg-gradient-primary': 'bg-gradient-to-r from-gradient-begin to-primary',
      'pseudo-col': 'absolute top-1_2 -translate-y-1_2 content-[""]'
    },
    [/^wh-(\d+)$/, ([, c]) => `w-${c} h-${c}`],
    [/^(m|p)([trblxy]?)-(\d+)$/, ([, c, d, e]) => `${c + d}-${e}rpx`],
    [/^(rounded)-(\d+)$/, ([, c, d]) => `${c}-${d}rpx`],
    [/^(.*)-important$/, ([, style]) => `${style}!`]
  ],
  separators: '__',
  postprocess(util) {
    // 自定义rem 转 rpx
    util.entries.forEach(i => {
      const value = i[1];
      if (value && typeof value === 'string' && remRE.test(value)) i[1] = `${value.slice(0, -3) * 16 * 2}rpx`;
    });
  }
});

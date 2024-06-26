/**
 * 工具函数
 */
import qs from 'qs';

/**
 * @const 定义TabBar的页面数组
 */
const tabViewArray = require('../../config/router').mainPage;

/**
 * @method 页面跳转
 * @description 包装wx.navigateTo方法,参数继承wx.navigateTo()的参数,拓展了部分参数
 * @param {object} query =[undefined] 页面的参数,自动挂在url后面
 * @param {string} type = ['navigate'] 跳转方式,可选navigate/redirect/relaunch 对应uni的三种跳转方式,仅对非tabBar页面起作用
 */

export const navigateTo = (config = {}, type = 'navigate') => {
  const is_tab = tabViewArray.includes(config.url);
  if (config.query) config.url = `${config.url}?${qs.stringify(config.query)}`;
  if (type == 'relaunch') return wx.reLaunch({ ...config });
  return is_tab
    ? wx.switchTab({ ...config })
    : type == 'redirect'
      ? wx.redirectTo({ ...config })
      : wx.navigateTo({ ...config });
};

/**
 * @method 页面返回
 */
export const navigateBack = (config = {}) =>
  getCurrentPages().length < 2 ? navigateTo(config, 'redirect') : wx.navigateBack(config);

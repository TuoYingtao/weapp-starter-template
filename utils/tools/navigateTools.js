
/**
 * 工具函数
 */
import qs from "qs";

/**
 * @const 定义TabBar的页面数组
 */
const tabViewArray = [
	"/pages/index/index",
	"/pages/sort/index",
	"/pages/cart/index",
	"/pages/user/index",
];

/**
 * @method 页面跳转
 * @description 包装uni.navigateTo方法,参数继承uni.navigateTo()的参数,拓展了部分参数
 * @param {object} query =[undefined] 页面的参数,自动挂在url后面
 * @param {string} type = ['navigate'] 跳转方式,可选navigate/redirect/relaunch 对应uni的三种跳转方式,仅对非tabBar页面起作用
 */

export const navigateTo = (config = {}, type = "navigate") => {
	const is_tab = tabViewArray.includes(config.url);
	if (config.query) config.url = `${config.url}?${qs.stringify(config.query)}`;
	if (type == "relaunch") return uni.reLaunch({ ...config });
	return is_tab ? uni.switchTab({ ...config }) : type == "redirect" ? uni.redirectTo({ ...config }) : uni.navigateTo({ ...config });
};

/**
 * @method 页面返回
 */
export const navigateBack = (config = {}) => (getCurrentPages().length < 2 ? navigateTo(config, "redirect") : uni.navigateBack(config));

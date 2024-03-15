import isNumber from 'lodash/isNumber'
import get from 'lodash/get'
import dayjs from 'dayjs'

/**
 * 格式化价格
 * @param {number}} val 金额（分）
 * @param {number} xiaoshu 小数位
 */
export const formatPrice = (val, xiaoshu = 2) => (isNumber(val) ? (val / 100).toFixed(xiaoshu) : "-");

/**
 * 格式化距离
 * @param {number} dis 距离,米
 */
export const formatDistance = (dis) => {
	if (dis >= 10009999) return '>10000 千米'
	else if (dis >= 1000) return `${Math.round(dis / 10) / 100} 千米`
	else return `${dis} 米`
}

/**
 * 格式化时间
 * @param {string|number} time 日期，支持字符串，10位或13位时间戳
 * @param {string} defaults 如果日期不合法返回的默认值
 * @param {string} format 格式化规则
 * @returns
 */
export const formatTime = (time, defaults = '-', format = 'YYYY-MM-DD HH:mm:ss') => {
	let dayTime = null;
	if (typeof time == 'number') {
		dayTime = dayjs(time > 9999999999 ? time : (time * 1000))
	} else {
		dayTime = dayjs(time)
	}

	return dayTime.isValid() ? dayTime.format(format) : defaults;
}

/**
 * @method 根据对象的path路径获取值
 * https://www.lodashjs.com/docs/lodash.get
 */
export const getURLParameter = get;

export default {
	install: (vue) => {
		let filters = { formatPrice, formatDistance, getURLParameter, formatTime };
		Object.keys(filters).forEach((key) => {
			vue.filter(key, filters[key]);
		});
		vue.prototype.$filters = filters;
	},
};

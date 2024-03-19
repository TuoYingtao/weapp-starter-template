/**
 * 全局事件注册
 */
class Event {

	static EVENT_LIST = [];

	constructor(eventName) {
		if (Event.EVENT_LIST.includes(eventName)) {
			throw new Error(`Global Event Error: event '${eventName}' is already exist`);
		}
		this.eventName = eventName;
		Event.EVENT_LIST.push(eventName);
	}

	static getEnumInstance(eventName) {
		return new Event(eventName);
	}

	static getEventList() {
		return Event.EVENT_LIST;
	}

	getEventList() {
		return Event.EVENT_LIST;
	}

	_getCurrentPage() {
		const current = getCurrentPages().pop();
		return current.getOpenerEventChannel();
	}

	/**
	 * 触发事件
	 * @param data 事件参数
	 * @returns {*}
	 */
	$emit(data) {
		return _getCurrentPage().emit(this.eventName, data);
	}

	/**
	 * 监听事件
	 * @param callback 执行方法
	 * @returns {*}
	 */
	$on(callback) {
		return _getCurrentPage().on(this.eventName, callback);
	}

	/**
	 * 一次性使用事件
	 * @param callback 执行方法
	 * @returns {*}
	 */
	$once(callback) {
		return _getCurrentPage().once(this.eventName, callback);
	}

	/**
	 * 移除事件
	 * @param callback 执行方法
	 * @returns {*}
	 */
	$off(callback) {
		return _getCurrentPage().off(this.eventName, callback);
	}
}

export default Event;

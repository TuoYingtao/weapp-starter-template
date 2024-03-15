import qs from 'qs';
import isString from 'lodash/isString'
import cloneDeep from 'lodash/cloneDeep';
import { navigateTo } from '@/utils/tools/navigateTools';
import {isEmpty} from "@/utils";

/**
 * 提示信息
 * @param str 提示信息
 * @param icon 提示icon 默认：none
 */
export function showToast(str, icon = 'none', duration = 1500,mask = true) {
	if (isEmpty(str)) return new Error(`提示信息不能为空`);
	uni.showToast({ icon: icon, title: str, duration: duration,mask: mask });
}

/**
 * 对话框
 * @param config 对话框配置
 * @param successCallback 确认事件
 * @param cancelCallback 取消事件
 * @returns {Promise<unknown>}
 */
export function showModal(config, successCallback, cancelCallback) {
	return new Promise((resolve, reject) => {
		const conf = {
			title: '提示',
			content: "",
			showCancel: true,
			cancelText: "取消",
			cancelColor: "#000000",
			confirmText: "确定",
			confirmColor: "#FF0000",
			editable: false,
			placeholderText: "",
			success: (res) => {
				if (res.confirm) {
					resolve(true);
				} else if (res.cancel) {
					resolve(false);
				}
			},
			fail: (err) => {
				console.error(err);
				reject(err);
			}
		};
		if (!isEmpty(successCallback)) {
			config.success = (res) => {
				if (res.confirm) {
					return successCallback(res);
				}
			}
		}
		if (!isEmpty(cancelCallback)) {
			config.success = (res) => {
				if (res.cancel) {
					return cancelCallback(res);
				}
			}
		}
		uni.showModal(Object.assign({}, conf, config));
	})
}

/**
 * 拨打手机号
 * @param phoneNumber 手机号
 */
export function makePhoneCall(phoneNumber) {
	if (!phoneNumber) return new Error(`拨打的号码不能为空`);
	uni.makePhoneCall({
		phoneNumber: phoneNumber,
		fail: (err) => {
			throw new Error(err.errMsg ?? '拨打手机号有误')
		}
	})
}

/**
 * 获取图片信息
 * 小程序下获取网络图片信息需先配置download域名白名单才能生效
 * @param imagePath
 * @returns {*}
 */
export function getImageInfo(imagePath) {
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src: imagePath,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				throw new Error(err.errMsg ?? '获取图片信息有误')
			}
		})
	});
}

/**
 * 保存图片
 * @param imageUrl 图片地址
 * @returns {Promise<unknown>}
 */
export function saveImage(imageUrl) {
	return new Promise((resolve, reject) => {
		uni.saveImageToPhotosAlbum({filePath: imageUrl}).then(([error, result]) => {
			if (error && error.errMsg) {
				if (error.errMsg === "saveImageToPhotosAlbum:fail:auth denied"
					|| error.errMsg === "saveImageToPhotosAlbum:fail auth deny"
					|| error.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
					uni.showModal({
						title: '提示',
						content: '需要授权才能将图片保存到相册',
						showCancel: false,
						success: (modalSuccess) => {
							uni.openSetting({
								success(settingData) {
									if (settingData.authSetting['scope.writePhotosAlbum']) {
										uni.showLoading({ title: '保存中...', mask: true })
										saveImage(imageUrl);
									} else {
										showToast('获取权限失败，将无法保存到相册')
									}
								}
							})
						}
					})
				} else {
					showToast('图片保存失败')
				}
			} else if (result && result.errMsg == "saveImageToPhotosAlbum:ok") {
				showToast('图片保存成功')
				resolve(result);
			}
		})
	});
}

/**
 * 设置粘贴板
 * @param data 复制的值；值的类型必须为String
 */
export function setClipboardData(data) {
	uni.setClipboardData({
		data,
		fail: (err) => {
			throw new Error(err.errMsg ?? '粘贴失败')
		}
	})
}

/**
 * 获取粘贴板的数据
 * @returns {Promise<unknown>}
 */
export function getClipboardData() {
	return new Promise((resolve, reject) => {
		uni.getClipboardData().then(([error, result]) => {
			if (error) throw new Error(result.errMsg ?? error);
			resolve(result)
		})
	})
}

/**
 * 跳转其它小程序
 * @param appId 要打开的小程序 appId（百度小程序则填写App Key）
 * @param path 打开的页面路径，如果为空则打开首页
 * @param extraData 需要传递给目标小程序的数据，目标小程序可在 App.vue 的 onLaunch或onShow 中获取到这份数据。
 * @param envVersion 要打开的小程序版本，有效值： develop（开发版），trial（体验版），release（正式版）。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
 */
export function navigateToMiniProgram(appId, path, extraData, envVersion = "release") {
	if (!isString(appId)) throw new Error(`appId:${appId} 不适一个合法的字符串`);
	return new Promise((resolve, reject) => {
		uni.navigateToMiniProgram({
			appId: appId,
			path: path,
			extraData: extraData,
			envVersion: envVersion,
			success(res) {
				resolve(res);
			},
			fail(error) {
				if (error.errMsg != "navigateToMiniProgram:fail cancel") {
					console.error(error);
					reject(error);
				}
			}
		})
	})
}

/**
 * 跳转回上一个小程序
 * 只有当另一个小程序跳转到当前小程序时才会能调用成功。
 * @param extraData 需要传递给目标小程序的数据，目标小程序可在 App.vue 的 onLaunch或onShow 中获取到这份数据。
 */
export function navigateBackMiniProgram(extraData) {
	return new Promise((resolve, reject) => {
		uni.navigateBackMiniProgram({
			extraData: extraData,
			success: (res) => resolve(res),
			fail: (error) => {
				console.error(error);
				reject(error);
			}
		})
	})
}



/**
 * 判断是否是扫码进入的小程序
 * onLoad 中获取所有入参，依照小程序规则，如 page=user&pid=1，将解析为 {page:'user', pid:'1'}
 * @param query 扫码参数
 */
export function isSearchScene(query) {
	console.info("启动页加载完成，参数:", query);
	let data = query;
	if (query.scene) {
		// 扫码进入的情况
		try {
			let sceneQuery = qs.parse(decodeURIComponent(query.scene));
			if (sceneQuery) {
				data = sceneQuery;
			}
			console.info("检测到扫码进入, query:", {...sceneQuery});
		} catch (e) {}
	}
	return data;
}

/**
 * 跳转处理
 */
export function handlePageNavigate() {
	const defaultPage = "/pages/index/index";
	// 检查页面是否存在
	let path = ROUTES.find((it) => it.path.endsWith(this.query.p))?.path ?? defaultPage;
	let query = cloneDeep(this.query);
	delete query.p;

	navigateTo({url: path, query}, "redirect");
}

/**
 * 获取网络图片缓存到本地
 */
export async function getImageUrl(url) {
	let path = null
	await uni.getImageInfo({
		src: url
	}).then(res => {
		path = res[1].path
	})
	return path
}

/**
 * 获取设备信息
 */
export function getSystemInfo() {
	try {
		const res = wx.getSystemInfoSync()
		const { platform, model } = res;
		if (['ios', 'mac', 'devtools'].includes(platform)) {
			res.isIosPlatform = true
		}
		if (
			/iphone\sx/i.test(model) ||
			(/iphone/i.test(model) && /unknown/.test(model)) ||
			/iphone\s1[1-9]/i.test(model)
		) {
			//iphone出新机型，小程序没更新会出现unknown的情况
			res.isIphoneX = true
		}
		return res;
	} catch (e) {
		throw new Error(e?.msg ?? "获取系统信息失败");
		// Do something when catch error
	}
}

/**
 * 检查小程序是否可更新
 */
export const checkAppUpdate = function() {

	// 小程序版本支持getUpdateManager方法
	if (uni.canIUse('getUpdateManager')) {
		const updateManager = uni.getUpdateManager();
		// 检查版本完成
		updateManager.onCheckForUpdate(function(res) {
			if (res.hasUpdate) {
				// 新版下载完成
				updateManager.onUpdateReady(function() {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，请重启小程序体验新版',
						showCancel: false,
						success: function() {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					})
				})
				// 下载失败
				updateManager.onUpdateFailed(function (res) {
					// 新的版本下载失败
					uni.showModal({
						title: '更新失败',
						content: '新版本下载失败，请删除当前小程序，重新搜索下载～',
						showCancel: false,
						success: (res) => {
							// 新版下载失败，退出小程序
							uni.navigateBack({
								delta: 0,
							});
						},
					});
				});
			}
		});
	}else{
		//如果用户手机的小程序版本过低提示
		uni.showModal({
			title: '温馨提示',
			content: '当前微信版本过低，功能无法使用，请升级微信客户端',
			showCancel: false
		});
	}
}

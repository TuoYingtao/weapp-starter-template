import { request } from "@/utils/request";
import {getUploadCos, setToken, setUploadCos, setUserInfoStorage} from "@/utils/storage";
import {camSafeUrlEncode, genNewKey, getCosSecurity} from "@/utils/cos";
import {showToast} from "@/utils/tools/index";
import store from "@/store"

const upload = {
	stsUrl: '/pub/upload/cos/token',
}
const prefix = process.env.PREVIEW_PICTURE_URL;

/**
 * 静默登录
 * @returns {Promise<unknown>}
 */
export function silenceAuthorizedLogin() {
  const requestInstance =  request.getRequest();
  return new Promise((resolve, reject) => {
    uni.login({scopes: 'auth_base'}).then(([error, result]) => {
			if (error) throw new Error(result.errMsg ?? error);
			let data = { code: result.code };
			const instance = requestInstance({ url: '/weixin/login', method: 'POST', data}, {
				urlPrefix: '/auth',
			});
			instance.then((res) => {
				setToken(res.Token, new Date().valueOf() + Number(res.Expires) * 1000);
				setUserInfoStorage({ legalMobile: res.LegalMobile, legalName: res.LegalName, account: res.Account, status: res.Status });
				store.dispatch('userInfo', res);
				resolve({ token: res.Token, isSilence: true });
			}).catch(error => {
				reject({ token: '', isSilence: false })
			});
		})
  })
}

/**
 * 获取临时腾讯云密钥
 * @param callback 执行回调
 * @param errCallback 错误回调
 */
export const getCredentials = function (callback, errCallback) {
	const cosSecurity = getUploadCos();
	let credentials = "";
	if (cosSecurity) {
		credentials = cosSecurity.Credentials;
		callback(cosSecurity && credentials);
	} else {
		const requestInstance =  request.getRequest();
		requestInstance({ url: upload.stsUrl, method: 'GET'}).then(data => {
			credentials = data.Credentials;
			if (credentials) {
				setUploadCos(data, data.StartTime, data.ExpiredTime);
				callback(data && credentials);
			}
		}).catch(err => {
			errCallback(err)
		})
	}
};

/**
 * 上传
 */
export function upLoadFileTemplate() {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			success: (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				const key = genNewKey(tempFilePaths[0]);
				getCosSecurity(function (authData) {
					uni.uploadFile({
						url: prefix,
						filePath: tempFilePaths[0],
						name: 'file',
						formData: {
							'key': key,
							'success_action_status': 200,
							'Signature': authData.Authorization,
							'x-cos-security-token': authData.XCosSecurityToken,
							'Content-Type': '',
						},
						success: (uploadFileRes) => {
							const src = camSafeUrlEncode(key).replace(/%2F/g, '/');
							const url = prefix + src;
							if (uploadFileRes.statusCode === 200) {
								resolve(url);
							} else {
								reject(uploadFileRes);
							}
						},
						fail: (err) => {
							if (err && err.errMsg == "uploadFile:fail Error: read ECONNRESET") {
								showToast('当前服务器繁忙，请稍后再试')
							}
							reject(err)
						}
					});
				}, function (error) {
					reject(error);
				})
			}
		});
  })
}

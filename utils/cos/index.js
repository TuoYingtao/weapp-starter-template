import { getCredentials } from "@/utils/tools/requestTools";

const CosAuth = require('./cos-auth');

/**
 * 对更多字符编码的 url encode 格式
 * @param str 目标值
 * @returns {string}
 */
export const camSafeUrlEncode = function(str) {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
};

/**
 * 计算签名
 * @param callback 执行回调
 * @param errCallback 错误回调
 */
export const getCosSecurity = function(callback, errCallback) {
    getCredentials(function(credentials) {
        callback({
            XCosSecurityToken: credentials.Token,
            Authorization: CosAuth({
                SecretId: credentials.TmpSecretId,
                SecretKey: credentials.TmpSecretKey,
                Method: 'POST',
                Pathname: '/',
            })
        });
    }, errCallback);
};

/**
 * 定义文件存储路径
 * @param filePath 文件本地缓存路径
 * @returns {string}
 */
export const genNewKey = function(filePath) {
    let date = new Date(),
        key = ['product/'];
    const f = function(time) {
        return time < 10 ? '0' + time : time;
    };
    let ext = filePath.substr(filePath.lastIndexOf('.') + 1);
    if (ext == "jpeg") {
        ext = 'jpg';
    }
    key.push(date.getFullYear());
    key.push(f((date.getMonth() + 1)));
    key.push(f(date.getDate()));
    key.push('/');
    key.push(f(date.getHours()));
    key.push(f(date.getMinutes()));
    key.push(f(date.getSeconds()));
    key.push('-');
    let fileName = filePath.substr(filePath.lastIndexOf('/') + 1).split('.')[0];
    key.push(fileName.toLowerCase());
    key.push('.');
    key.push(ext);
    return key.join('');
}

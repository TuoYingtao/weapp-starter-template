/**
 * @const token储存的key
 */
export const TOKEN_KEY = "user_token";

/**
 * 腾讯云临时密钥存储
 * @type {string}
 */
export const UPLOAD_COS_KEY = "upload_cos_key";

/**
 * 用户信息
 * @type {string}
 */
export const USER_INFO_KEY = "user_info_key";

/**
 * 删除缓存
 * @param storageKey
 * @returns {*}
 */
export const removeStorage = (storageKey) => {
  return uni.removeStorageSync(storageKey)
}

/**
 * 获取token
 */
export const getToken = () => {
  let data = uni.getStorageSync(TOKEN_KEY);
  if (!data) data = { value: "", create_time: 0, expire_time: 0 };
  if (data.expire_time == 0) return data.value;
  else if (new Date().valueOf() - data.create_time > data.expire_time) return "";
  else return data.value;
};

/**
 * 设置token
 * @param {string} token token的值
 * @param {number} expireTime 过期时间(毫秒数)
 */
export const setToken = (token = "", expireTime = 0) => {
  uni.setStorageSync(TOKEN_KEY, {
    create_time: new Date().valueOf(),
    expire_time: expireTime,
    value: token,
  });
};

/**
 * 获取用户信息
 * @returns {*}
 */
export const getUserInfoStorage = () => {
  let data = uni.getStorageSync(USER_INFO_KEY);
  return data;
}

/**
 * 设置用户信息
 * @param userinfo
 */
export const setUserInfoStorage = (userinfo) => {
  uni.setStorageSync(USER_INFO_KEY, userinfo);
}

/**
 * 获取腾讯云临时密钥
 * @returns {string|any}
 */
export const getUploadCos = () => {
  let data = uni.getStorageSync(UPLOAD_COS_KEY);
  if (!data) data = { value: "", startTime: 0, expireTime: 0 };
  if (data.expireTime == 0) return "";
  if (Date.now() / 1000 + 30 >= data.expireTime) return "";
  return JSON.parse(data.value);
}

/**
 * 设置腾讯云临时密钥
 * @param data 密钥数据
 * @param startTime 密钥创建时间
 * @param expireTime 密钥过期时间
 */
export const setUploadCos = (data = {}, startTime, expireTime = 0) => {
  uni.setStorageSync(UPLOAD_COS_KEY, {
    startTime,
    expireTime,
    value: JSON.stringify(data)
  })
}

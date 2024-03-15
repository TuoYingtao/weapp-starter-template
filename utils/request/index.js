import merge from 'lodash/merge';
import isString from 'lodash/isString';
import { NetworkError, RequestError, ResponseError } from "./ResponseErrorHandler.js";
import { VRequest } from "@/utils/request/Request";
import { getToken } from "../storage";
import { joinTimestamp, setObjToUrlParams } from "./requestUtils";
import {CONTENT_TYPE_MAP, DATA_TYPE_MAP, REQUEST_STATUS_CODE, RESPONSE_TYPE_MAP} from "@/utils/request/RequestConstant";
import { silenceAuthorizedLogin } from "@/utils/tools/requestTools";
import global from "@/config/global";

// 如果是mock模式 或 没启用直连代理 就不配置HOST 会走本地Mock拦截
const HOST = process.env.API_BASE_URL;

let requestQueue = [];
let isSilenceLock = false;

const onAccessTokenFetched = () => {
  try {
    isSilenceLock = false;
    requestQueue.forEach((callback) => callback())
  } finally {
    requestQueue = [];
  }
}

const transform = {

  /**
   * 响应处理
   * @param res 请求响应对象
   * @param options Request配置参数
   * @returns {*}
   */
  transformRequestHook: (res, options) => {
    const { isTransformResponse, isTransformCodeResponse, isReturnNativeResponse } = options;
    return new Promise((resolve, reject) => {
      const method = res.config.method.toUpperCase();
      if (res.status == 204 || method === 'PATCH') {
        resolve(res.data);
      }
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (isReturnNativeResponse) {
        resolve(res);
      }
      // 不进行任何处理，直接返回 用于页面代码可能需要直接获取code，data，message这些信息时开启
      if (!isTransformResponse) {
        resolve(res.data);
      }
      const { config, data } = res;
      if (!data) {
        throw new ResponseError('【Response Error】请求接口错误', config.url, data.status, data, res);
      }
      const { code, message } = data;
      switch (code) {
        case REQUEST_STATUS_CODE.successCode:
          // 不进行任何处理，直接返回 用于页面代码可能需要直接获取code，data，message这些信息时开启
          if (!isTransformCodeResponse) {
            resolve(data);
          }
          resolve(data.data);
          break;
        case REQUEST_STATUS_CODE.tokenAuthCode:
          config.isAuthorized = true;
          if (!isSilenceLock) {
            isSilenceLock = true;
            silenceAuthorizedLogin().then((silence) => silence.isSilence && onAccessTokenFetched());
          }
          requestQueue.push(() => resolve(request.executor(config)));
          break;
        case REQUEST_STATUS_CODE.errorCode:
        default:
          uni.showToast({ icon: 'none', title: message });
          throw new ResponseError(`【Response Error】${message || '未知错误'}`, config.url, data.status, data, res);
      }
    })
  },

  /**
   * 请求前置处理
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {*}
   */
  beforeRequestHook: (config, options) => {
    const { apiUrl, isJoinPrefix, urlPrefix, joinParamsToUrl, joinTime = true, fieldTime, fixedParams } = options;
    // 添加接口前缀
    if (isJoinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }
    // 将baseUrl拼接
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    if (config.method.toUpperCase() === "GET") {
      if (!isString(params)) {
        // 给 GET 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, fieldTime, false));
      } else {
        config.url = `${config.url}${params}${joinTimestamp(joinTime, fieldTime, true, false)}`;
        config.params = undefined;
      }
    } else if (!isString(params)){
      if (config && config.data && Object.keys(config.data).length > 0) {
        config.data = data;
        config.params = params;
      } else {
        // 非GET请求如果没有提供data，则将params视为data
        config.data = params;
        config.params = undefined;
      }
      if (joinParamsToUrl) {
        config.url = setObjToUrlParams(config.url, { ...config.params, ...config.data });
      }
    } else {
      // 兼容restful风格
      config.url += params;
      config.params = undefined;
    }
    // 拼接固定参数
    if (fixedParams && Object.keys(fixedParams).length > 0) {
      config.url = setObjToUrlParams(config.url, fixedParams);
    }
    config.data = Object.assign({}, !isString(params) && params, data);
    delete config.params;
    return config;
  },

  /**
   * 请求前的拦截器
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {{header}|*}
   */
  requestInterceptors: (config, options) => {
    const header = config.header || options.headers;
    const contentType = header['Content-Type'] || header['content-type'];
    config.header = config.header || {};
    config.header['Content-Type'] = contentType;
    if (config.method.toUpperCase() === "POST"
      && contentType !== CONTENT_TYPE_MAP.formData) {
      config.header['Content-Type'] = CONTENT_TYPE_MAP.formData;
    }
    let token = getToken();
    if (token && options.requestOptions.withToken != false) {
      config.header[options.requestOptions.fieldToken] = options.requestOptions.authenticationScheme
        ? `${options.requestOptions.authenticationScheme} ${token}`
        : token;
    }
    if (options.requestOptions.joinTokenUrl) {
      if (token) {
        config.url = setObjToUrlParams(config.url, { [options.requestOptions.fieldToken]: token });
      }
    }
    config.timeout = options.timeout;
    config.withCredentials = options.withCredentials;
    config.dataType = options.dataType;
    config.responseType = options.responseType;
    return config;
  },

  /**
   * 响应拦截器
   * @param error Request 请求规范错误信息
   * @param response Request 请求响应对象
   * @param conf Request请求参数
   * @returns {*&{config: *}}
   */
  responseInterceptors: ([error, response], conf) => {
    const requestConfig = { config: conf }
    if (error && error.errMsg) {
      if (error.errMsg == "request:fail") {
        throw new NetworkError('【Response Error】网络连接异常', requestConfig);
      }
      if (error.errMsg == "request:fail timeout") {
        requestConfig.isRetry = true;
        throw new NetworkError('【Response Error】网络连接超时', requestConfig);
      }
      throw new NetworkError(`【Response Error】${error.errMsg ?? '未定义的请求错误'}`, requestConfig);
    } else {
      if (response.statusCode != 200) {
        requestConfig.isRetry = true;
        throw new ResponseError(
          `【Response Error】Request fail with status code ${response.statusCode} domain name addresses ${conf.url}`,
          conf.url, response.statusCode, response.data, response)
      }
      return { ...response, ...requestConfig };
    }
  },

  /**
   * 响应错误拦截
   * @param error Request 请求错误信息体
   * @returns {Promise<never>|Promise<void>}
   */
  responseInterceptorsCatch: (error) => {
    const { config } = error;
    if (!config || !config.requestOptions.retry) return Promise.reject(error);
    config.retryCount = config.retryCount || 0;
    if (config.retryCount >= config.requestOptions.retry.count) return Promise.reject(error);
    config.retryCount += 1;
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve(config);
      }, config.requestOptions.retry.delay || 1);
    });
    return backoff.then((config) => request.executor(config));
  }
}

/**
 * 创建 Request 请求实例对象
 * @param options Request配置参数
 * @returns {VRequest}
 */
function createRequest(options) {
  return new VRequest(merge({
    // 超时时间
    timeout: 10 * 1000,
    // 携带Cookie
    withCredentials: true,
    // 如果设为 json，会尝试对返回的数据做一次 JSON.parse
    dataType: DATA_TYPE_MAP.json,
    // 设置响应的数据类型。合法值：text、arraybuffer
    responseType: RESPONSE_TYPE_MAP.text,
    // 头信息
    headers: { 'Content-Type': CONTENT_TYPE_MAP.json },
    // 请求数据
    transform,
    requestOptions: {
      // 请求IP地址
      apiUrl: HOST,
      // 是否自动添加接口前缀
      isJoinPrefix: true,
      // 接口前缀
      urlPrefix: '/api',
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      isReturnNativeResponse: false,
      // 需要对返回数据进行处理
      isTransformResponse: true,
      // 当code为200 时，需要对返回数据进行处理
      isTransformCodeResponse: true,
      // post请求的时候添加参数到url
      joinParamsToUrl: false,
      // 是否加入时间戳
      joinTime: true,
      // 时间戳字段 默认: _t
      fieldTime: 'timestamp',
      // 忽略重复请求
      ignoreRepeatRequest: true,
      // token 参数是否拼接到url中
      joinTokenUrl: true,
      // Header 头是否携带token
      withToken: true,
      // token 字段
      fieldToken: 'token',
      // token 令牌前缀如：'Bearer'
      authenticationScheme: '',
      // 重试机制
      retry: {
        count: 3,
        delay: 1000,
      },
      // 固定参数 如小程序版本号
      fixedParams: {
        mpVersion: global.app_version,
        src: global.src,
        userKey: global.userKey,
      }
    }
  }, options || {}));
}

export const request = createRequest();

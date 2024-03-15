import cloneDeep from 'lodash/cloneDeep';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import {ResponseError} from "@/utils/request/ResponseErrorHandler";

/**
 * Request 请求对象
 */
export class VRequest {

  // request 实例
  #privateInstance;

  // request 选项
  #privateOptions;

  // 定时器
  #privateTimer = null;

  /**
   * @param options Request配置参数
   */
  constructor(options) {
    this.#privateOptions = options;
    this.#privateCreateRequest();
  }

  /**
   * 获取request实例
   * @returns {*}
   */
  getRequest() {
    return this.#privateInstance;
  }

  /**
   * 设置request配置参数
   * @param options Request配置参数
   * @returns {boolean}
   */
  setConfigRequest(options) {
    if (!this.#privateInstance) throw new Error('request 实例不能为空');
    this.#privateOptions = Object.assign({}, this.#privateOptions, options);
  }

  /**
   * 创建request实例
   */
  #privateCreateRequest() {
    this.#privateInstance = (config, options) => this.executor(config, options);
  }

  /**
   * 获取数据处理
   * @returns {*}
   */
  #privateGetTransform() {
    const { transform } = this.#privateOptions;
    return transform;
  }

  /**
   * request 请求前置钩子
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {Promise<unknown>}
   */
  #privateSetupBeforeHook(config, options) {
    const transform = this.#privateGetTransform();
    if (!transform) {
      console.warn('处理数据参数不能为空！')
    }
    let conf = cloneDeep(config);
    const { requestOptions } = this.#privateOptions;
    const opt = { ...requestOptions, ...options };
    const { beforeRequestHook } = transform;
    return new Promise((resolve, reject) => {
      if (beforeRequestHook && isFunction(beforeRequestHook)) {
        conf = beforeRequestHook(conf, opt);
      }
      conf.requestOptions = opt;
      resolve(conf);
    })
  }

  /**
   * 设置请求拦截
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {Promise<unknown>}
   */
  #privateSetupInterceptors(config, options) {
    const transform = this.#privateGetTransform();
    if (!transform) {
      console.warn('处理数据参数不能为空！')
    }
    let conf = cloneDeep(config);
    const opt = { ...this.#privateOptions };
    opt.requestOptions = { ...opt.requestOptions, ...options }
    const { requestInterceptors } = transform;
    return new Promise((resolve, reject) => {
      if (requestInterceptors && isFunction(requestInterceptors)) {
        conf = requestInterceptors(config, opt);
      }
      conf.requestOptions = opt.requestOptions;
      resolve(conf);
    })
  }

  /**
   * GET 请求
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {Promise<*>}
   */
  get(config, options) {
    config.method = 'GET'
    return this.executor(config, options);
  }

  /**
   * POST 请求
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {Promise<*>}
   */
  post(config, options) {
    config.method = 'POST'
    return this.executor(config, options);
  }

  /**
   * PUT 请求
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {Promise<*>}
   */
  put(config, options) {
    config.method = 'PUT'
    return this.executor(config, options);
  }

  /**
   * DELETE 请求
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {Promise<*>}
   */
  delete(config, options) {
    config.method = 'DELETE'
    return this.executor(config, options);
  }

  /**
   * PATCH 请求
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {Promise<*>}
   */
  patch(config, options) {
    config.method = 'PATCH'
    return this.executor(config, options);
  }

  /**
   * 核心执行方法
   * @param config Request请求参数
   * @param options Request配置参数
   * @returns {Promise<void>}
   */
  executor(config, options) {
    let conf = config || {};
    const { transform } = this.#privateOptions;
    if (conf && isUndefined(conf.retryCount) && isUndefined(conf.isAuthorized)) {
      let confOpt = cloneDeep(conf);
      const { requestOptions } = this.#privateOptions;
      const opt = { ...requestOptions, ...options };
      const { beforeRequestHook } = transform;
      if (beforeRequestHook && isFunction(beforeRequestHook)) {
        conf = beforeRequestHook(confOpt, opt);
      }
      conf.requestOptions = opt;
    }
    if ((conf && isUndefined(conf.retryCount)) || !isUndefined(conf.isAuthorized)) {
      let confOpt = cloneDeep(conf);
      const opt = { ...this.#privateOptions };
      opt.requestOptions = { ...opt.requestOptions, ...options }
      const { requestInterceptors } = transform;
      if (requestInterceptors && isFunction(requestInterceptors)) {
        conf = requestInterceptors(confOpt, opt);
      }
      conf.requestOptions = opt.requestOptions;
    }
    const requestTask = uni.request(conf);
    return requestTask.then(([error, response]) => {
      const { responseInterceptors, responseInterceptorsCatch, transformRequestHook } = transform;
      try {
        const res = responseInterceptors([error, response], conf);
        const data = transformRequestHook(res, conf.requestOptions);
        return data;
      } catch (e) {
        if (e.requestConfig && e.requestConfig.isRetry) {
          responseInterceptorsCatch(e.requestConfig);
        }
        uni.showToast({ icon: 'none', title: e.message });
        throw new ResponseError(`
请求地址：${e.url || conf.url};
错误信息：${e.message};`);
      }
    }).finally(() => {

    });
  }
}

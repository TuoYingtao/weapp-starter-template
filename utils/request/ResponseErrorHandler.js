export class NetworkError extends Error {
	/**
	 * @param message 错误信息
	 * @param requestConfig 请求参数
	 */
	constructor(message, requestConfig) {
		super(message)
		this.requestConfig = requestConfig;
	}
}

export class RequestError extends NetworkError {
	/**
	 * @param message 错误信息
	 * @param requestConfig 请求参数
	 */
	constructor(message, requestConfig) {
		super(message, requestConfig)
	}
}

export class ResponseError extends Error {
	/**
	 * @param message 错误信息
	 * @param url 请求地址
	 * @param statusCode 请求状态码
	 * @param responseBody 响应data内容
	 * @param response 整个响应体
	 */
	constructor(message, url, statusCode, responseBody, response) {
		super(message)
		this.message = message ?? responseBody.message;
		this.url = url;
		this.statusCode = statusCode;
		this.responseBody = responseBody;
		this.response = response;
	}
}

/**
 * 清除前后空格
 * @param str 字符串
 * @returns {*}
 */
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * 去除所有空格
 * @param str 字符串
 * @returns {*}
 */
export function removeAllSpace(str) {
  return str.replace(/\s+/g, "");
}

/**
 * 判断是否为空
 * @param str 字符串
 * @returns {boolean}
 */
export function isEmpty(str) {
  if (str == null || Object.prototype.toString.call(str).slice(8, -1) == 'Undefined' ||
    (Object.prototype.toString.call(str).slice(8, -1) === "String"
      && (trim(str) == '' || trim(str) == 'null'))) {
    return true;
  } else {
    return false;
  }
}

/**
 * 判断是否为数组类型
 * @param arr 数组对象
 * @returns {boolean}
 */
export function isArray(arr) {
  return (typeof arr == 'object') && arr.constructor == Array
}

/**
 * 判断对象是否为空
 * @param obj 字符串
 * @returns {boolean}
 */
export function isEmptyObj(obj) {
  return Object.keys(obj) === 0 ? true : false
}

/**
 * 节流函数
 * @param func 执行方法
 * @param delay 延迟时间（毫秒）默认：1000
 * @returns {function(): void}
 */
export function throttle(func, delay = 1000) {
  let timer = null;
  let startTime = Date.now();
  return function() {
    const curTime = Date.now();
    const remaining = delay - (curTime - startTime);
    clearTimeout(timer);
    if (remaining <= 0) {
      func.apply(this, arguments);
      startTime = Date.now();
    } else {
      timer = setTimeout(() => false, remaining);
    }
  }
}

/**
 * 防抖函数
 * @param func 执行方法
 * @param wait 等待时间（毫秒）默认：600
 * @returns {function(...[*]=): void}
 */
export function debounce(func, wait = 600) {
  let timeout = null
  return function() {
    if (timeout !== null) clearTimeout(timeout);
    const execute = () => {
      func.apply(this, arguments)
    }
    timeout = setTimeout(execute, wait);
  }
}


/**
 * 获取url地址中的参数
 */
export function getURLParameter(name, url) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [,
    ""
  ])[1]
    .replace(/\+/g, '%20')) || null;
}

/**
 * 对象深拷贝
 * @param obj 数组
 * @returns {*[]}
 */
export function deepCopy(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

/**
 * 手机号正则验证
 * @param {*} phone 手机号
 */
export function regPhone(phone) {
  let regPhone = /^1[3456789]\d{9}$/;
  return !regPhone.test(phone);
}

/**
 * 字符长度验证
 * @param params 字符串
 * @param min 最小字符 默认：2
 * @param max 最大字符串 默认：10
 * @returns {boolean}
 */
export function regName(params, min = 2, max = 10) {
  const pattern = params.toString().replace(/\s/g, '').length > max
    || params.toString().replace(/\s/g, '').length < min;
  return pattern;
}

/**
 * 解析时间戳
 * @param time 时间戳
 * @param format 时间戳美化格式
 * @returns {string}
 */
export function parseTime(time, pattern = "yyyy-MM-dd hh:mm:ss") {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time);
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * 经纬度转换成三角函数中度分表形式
 * @param d
 * @returns {number}
 */
export function rad(d) {
  return d * Math.PI / 180.0;
}


/**
 * 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  * @param lat1 纬度-1
 * @param lng1 进度-1
 * @param lat2 纬度-2
 * @param lng2 进度-2
 * @returns {number}
 */
export function getDistance(lat1, lng1, lat2, lng2) {
  const radLat1 = rad(lat1);
  const radLat2 = rad(lat2);
  const a = radLat1 - radLat2;
  const b = rad(lng1) - rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里

  // var distance = s;
  // var distance_str = "";

  // if (parseInt(distance) >= 1) {
  // 	distance_str = distance.toFixed(1) + "km";
  // } else {
  // 	distance_str = distance.toFixed(3) * 1000 + "m";
  // }

  return s.toFixed(3) * 1000;
}

/**
 * 阿里OSS图片处理
 * 文档详见https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.6.744.e6861690GmP75X
 * @param url 为服务器返回 imageUrl
 * @param limit 指定当目标缩放图大于原图时是否进行缩放。1：表示不按指定参数进行缩放，直接返回原图。0：按指定参数进行缩放。
 * @param mode 压缩模式
 * @param width 二倍图设计稿宽度
 * @param height 二倍图设计稿高度
 * @param pixelRatio 设备像素比 默认：1
 * @returns {string}
 */
export function getAliOssImageUrl(url, limit = 0, mode = "fill", width, height, pixelRatio = 1) {
  return height ?
    `${url}?x-oss-process=image/resize,limit_${limit},m_${mode},w_${width/2*pixelRatio},h_${height/2*pixelRatio}` :
    `${url}?x-oss-process=image/resize,limit_${limit},m_${mode},w_${width/2*pixelRatio}`
}

/**
 * 腾讯OSS图片处理
 * 文档详见https://cloud.tencent.com/document/product/1246/45370
 * @param url 为服务器返回 imageUrl
 * @param mode 压缩模式
 * @param width 二倍图设计稿宽度
 * @param height 二倍图设计稿高度
 * @param pixelRatio 设备像素比 默认：1
 * @returns {string}
 */
export function getTenOssImageUrl(url, mode = 2, width, height, pixelRatio = 1) {
  return height ?
    `${url}?imageView2/${mode}/w/${width/2*pixelRatio}/h/${height/2*pixelRatio}` :
    `${url}?imageView2/${mode}/w/${width/2*pixelRatio}`

}

/**
 * 展开所有嵌套数组
 * @param arr 数组
 * @param d 层级
 * @returns {*}
 */
export function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), []) :
    arr.slice();
};


/**
 * 图片地址转换成base64
 * @param url 网络图片地址
 * @returns {Promise<unknown>}
 */
// #ifdef H5
export function getBase64(url) {
  return new Promise((resolve, reject) => {
    const Img = new Image()
    let dataURL = ''
    Img.setAttribute('crossOrigin', 'Anonymous')
    Img.src = url + '?v=' + Math.random()
    Img.onload = function() {
      // 要先确保图片完整获取到，这是个异步事件
      const canvas = document.createElement('canvas') // 创建canvas元素
      const width = Img.width // 确保canvas的尺寸和图片一样
      const height = Img.height
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
      dataURL = canvas.toDataURL('image/png') // 转换图片为dataURL
      resolve(dataURL)
    }
  })
}

/**
 * H5下载图片
 * @param url 网络图片地址
 */
export function funDownload(url) {
  // 创建隐藏的可下载链接
  let eleLink = document.createElement('a');
  eleLink.download = "share.png";
  eleLink.style.display = 'none';
  eleLink.href = url
  // eleLink.href = domImg.src
  // // 图片转base64地址
  // var canvas = document.createElement('canvas');
  // var context = canvas.getContext('2d');
  // var width = domImg.naturalWidth;
  // var height = domImg.naturalHeight;
  // context.drawImage(domImg, 0, 0);
  // // 如果是PNG图片，则canvas.toDataURL('image/png')
  // eleLink.href = canvas.toDataURL('image/jpeg');
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

/**
 * 判断是否在微信浏览器打开页面
 * @returns {boolean}
 */
export function isWeixn() {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}
// #endif

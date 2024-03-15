const CONFIG = {
  /** 是否开启uni统计 */
  UNI_STATISTICS: true,

  /** 分包优化 */
  OPTIMIZATION: true,

  REQUEST_PATH: {
    /** 开发地址 */
    dev: 'https://localhost:8080',

    /** 生产地址 */
    pro: 'https://localhost:8080',

    /** 测试地址 */
    test: '',
  },

  /** 小程序AppID */
  APPLET_MAP: {
    WX_APP_ID: '',
    ALIPAY_APP_ID: '',
    BAIDU_APP_ID: '',
    TOUTIAO_APP_ID: '',
    LARK_APP_ID: '',
    QQ_APP_ID: '',
    KUAISHOU_APP_ID: '',
  },

  /** COS 云存储对象 */
  COS_DATA: {
    Bucket: '',
    Region: '',
  }
}

/** COS 云存储对象域名 */
const previewPictureUrl = `https://${CONFIG.COS_DATA.Bucket}.cos.${CONFIG.COS_DATA.Region}.myqcloud.com/`;

function envHandler() {
  const GLOBAL_CONFIG = {};
  const appleEnvAppID = () => {
    switch (process.env.VUE_APP_PLATFORM) {
      case 'mp-weixin': return CONFIG.APPLET_MAP.WX_APP_ID; break;
      case 'mp-alipay': return CONFIG.APPLET_MAP.ALIPAY_APP_ID; break;
      case 'mp-baidu': return CONFIG.APPLET_MAP.BAIDU_APP_ID; break;
      case 'mp-toutiao': return CONFIG.APPLET_MAP.TOUTIAO_APP_ID; break;
      case 'mp-lark': return CONFIG.APPLET_MAP.LARK_APP_ID; break;
      case 'mp-qq': return CONFIG.APPLET_MAP.QQ_APP_ID; break;
      case 'mp-kuaishou': return CONFIG.APPLET_MAP.KUAISHOU_APP_ID; break;
      default: '';
    }
  }
  if (process.env.NODE_ENV === 'development') {
    GLOBAL_CONFIG.API_BASE_URL = CONFIG.REQUEST_PATH.dev;
  } else if (process.env.NODE_ENV === 'production') {
    GLOBAL_CONFIG.API_BASE_URL = CONFIG.REQUEST_PATH.pro;
  } else if (process.env.NODE_ENV === 'staging') {
    GLOBAL_CONFIG.API_BASE_URL = CONFIG.REQUEST_PATH.test;
  }
  GLOBAL_CONFIG.UNI_STATISTICS = CONFIG.UNI_STATISTICS;
  GLOBAL_CONFIG.OPTIMIZATION = CONFIG.OPTIMIZATION;
  GLOBAL_CONFIG.PREVIEW_PICTURE_URL = previewPictureUrl;
  GLOBAL_CONFIG.APPLET_APPID = appleEnvAppID();
  return GLOBAL_CONFIG;
}

module.exports = envHandler();

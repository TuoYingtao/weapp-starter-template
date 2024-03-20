// app.js
import envConfig from '@/config/env.js';
import router from '@/config/router.js';
import { setUserInfoStorage } from '@/utils/storage';
import { formatTime } from '@/utils/index';
import { showToast } from '@/utils/tools/index';

App({
  onLaunch() {
    console.log(wx.getAccountInfoSync());
    console.log(this.globalData);
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    setUserInfoStorage({ username: 'aaa' });
    console.log(formatTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}'));
    showToast('afadsf');
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
  },
  globalData: {
    application: {
      ...envConfig,
    },
    router: router,
    userInfo: null,
  },
});

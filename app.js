// app.js
// import { objectToJoin } from "@/utils/index.js";

const envConfig = require("@/config/env.js");
App({
  onLaunch() {
    console.log(wx.getAccountInfoSync());
    console.log(this.globalData);
    console.log(objectToJoin());
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    ...envConfig,
    userInfo: null,
  }
})

function aa() {
  objectToJoin();
}

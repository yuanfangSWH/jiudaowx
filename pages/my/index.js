// pages/my/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasInfo: false,
    userInfo: {},
  },
  getuserinfo: function (e) {
    console.log(e.detail);
    if (e.detail) {
      app.globalData.userInfo = e.detail.userInfo;
      app.saveUserInfo();
      this.setData({
        hasInfo: true,
        userInfo: e.detail.userInfo
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FF9511', // 窗口的背景色为白色
    })
    app.api('/wechat/user/get', null, (status, res) => {
      if (status) {
        if (res.data.avatar_url) {
          this.data.hasInfo = true;
          this.data.userInfo = res.data;
          this.data.userInfo.avatarUrl = res.data.avatar_url;
          this.data.userInfo.nickName = res.data.nick_name;
          this.setData(this.data);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
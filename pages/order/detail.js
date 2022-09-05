// pages/order/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {}
  },
  goGoods: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      app.api('/wechat/order/get', {id: options.id}, (status, res) => {
        if (status) {
          res.data.reayPay = res.data.total_money + res.data.express - res.data.discount;
          this.setData({
            'orderDetail': res.data
          });
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
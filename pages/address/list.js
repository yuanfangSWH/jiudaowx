// pages/address/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },
  loadData: function () {
    app.api('/wechat/address/get', null, (status, res) => {
      if (status) {
        this.setData({
          addressList: res.data
        })
      }
    })
  },
  select: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync('address', this.data.addressList[index]);
    wx.navigateBack();
  },
  goEdit: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address/edit?id=' + id
    })
  },
  newAddress: function () {
    wx.navigateTo({
      url: '/pages/address/edit'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData();
  }
})
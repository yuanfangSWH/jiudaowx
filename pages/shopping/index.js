// pages/shopping/index.js
var trolley = require('../../utils/trolley');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalMoney: 0
  },

  handleChange: function (e) {
    console.log('Change', e);
  },
  checkboxChange: function (e) {
    console.log('check', e);
    this.trolleyToArray(trolley.select(e.detail.value));
  },
  onChange: function (e) {
    var index = e.currentTarget.dataset.index,
      number = e.detail;
    this.trolleyToArray(trolley.set(this.data.goodsList[index], number, 'update'));
  },
  deleteGoods: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否将该商品移除购物车',
      success: res => {
        if (res.confirm) {
          this.trolleyToArray(trolley.set(this.data.goodsList[index], 0, 'update'));
        }
      }
    })
  },
  takeOrder: function (e) {
    var bool = this.data.goodsList.some(item => item.select);
    if (!bool) {
      return wx.showModal({
        title: '提示',
        content: '您还没选择商品',
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/takeOrder'
      })
    }
  },
  trolleyToArray: function (trolley) {
    var temp = Array();
    for (const key in trolley) {
      if (trolley.hasOwnProperty(key)) {
        temp.push(trolley[key]);
      }
    }
    var totalMoney = 0;
    temp.forEach(item => {
      if (item.select) {
        totalMoney += item.price * item.number;
      }
    })
    totalMoney = totalMoney.toFixed(2);
    this.setData({
      goodsList: temp,
      totalMoney: totalMoney
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    var trolleyData = wx.getStorageSync('trolley') || {};
    this.trolleyToArray(trolleyData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var trolleyData = wx.getStorageSync('trolley') || {};
    this.trolleyToArray(trolleyData);
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
})
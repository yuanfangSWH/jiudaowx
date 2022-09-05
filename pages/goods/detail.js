// pages/goods/detail.js
var app = getApp();
//调用自己写的第三方库
var trolley = require('../../utils/trolley');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品数据
    goodsDetail: {},
    //数量
    number: 1,
    totalMoney: 0,
    express: 0
  },
  //数量事件
  onChange: function (e) {
    //当前数量值是否小于0，是=1 否=当前数量值
    var number = e.detail <= 0 ? 1 : e.detail;
    var totalMoney = (this.data.goodsDetail.price * number).toFixed(2);
    this.setData({
      number: number,
      totalMoney: totalMoney
    })
  },
  addToCart: function () {
    trolley.set(this.data.goodsDetail, this.data.number, 'add');
    wx.showModal({
      title: '提示',
      content: '是否前去购物车结算',
      success: function(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/shopping/index'
          })
        }
      }
    })
  },
  //立即下单
  takeOrder: function () {
    trolley.selectAll(false);
    //商品数据，数量，分类
    trolley.set(this.data.goodsDetail, this.data.number, 'update');
    //保留当前页面，跳转
    wx.navigateTo({
      url: '/pages/order/takeOrder'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      app.api('/wechat/goods/get?id=' + options.id, null, (status, res) => {
        if (status) {
          this.setData({
            goodsDetail: res.data,
            totalMoney: res.data.price
          })
        }
      })
    }
  },
})
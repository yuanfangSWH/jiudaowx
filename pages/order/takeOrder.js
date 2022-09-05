// pages/order/takeOrder.js
var app = getApp();
var trolley = require('../../utils/trolley');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    address: {},
    hasAddress: false,
    totalMoney: 0,
    remark: '',
    orderId: '',
    visible: false,
    actions: [{
        name: '货到付款',
        color: '#2d8cf0',
      },
      {
        name: '微信支付',
        color: '#19be6b'
      },
      {
        name: '取消'
      }
    ],
  },
  inputRemark: function (e) {
    this.data.remark = e.detail.value;
  },
  takeOrder: function () {
    if (!this.data.address.id) {
      return wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
    }
    var postData = {
      address_id: this.data.address.id,
      remark: this.data.remark,
      detail: this.data.goodsList
    }
    app.api('/wechat/order/take', postData, (status, res) => {
      if (status) {
        this.data.orderId = res.data;
        wx.showToast({
          title: '下单成功!',
          icon: 'success'
        })
        this.data.goodsList.forEach(item => {
          trolley.set(item, 0, 'update');
        })
        this.setData({
          visible: true
        });
      }
    }, 'POST')
  },
  handleClick: function (e) {
    var index = e.detail.index;
    if (index === 0) {
      app.api('/wechat/order/setPayType', {
        id: this.data.orderId,
        type: 1
      }, (status, res) => {
        if (status) {
          wx.redirectTo({
            url: '/pages/order/index'
          })
        }
      })
    } else if (index === 1) {
      app.api('/wechat/order/setPayType', {
        id: this.data.orderId,
        type: 2
      }, (status, res) => {
        
      })
      app.api('/wechat/order/pay', {
        id: this.data.orderId
      }, (status, res) => {
        if (status) {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success: function () {
              wx.showToast({
                title: '支付成功!',
                icon: 'success'
              });
              wx.redirectTo({
                url: '/pages/order/index'
              });
            },
            fail: function () {
              wx.showToast({
                title: '支付失败!',
                image: '/images/error.png'
              })
            }
          })
        }
      })
    }
    this.setData({
      visible: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从本地缓存中同步获取trolley
    var trolleyData = wx.getStorageSync('trolley') || {};
    var temp = Array();
    for (const key in trolleyData) {
      if (trolleyData.hasOwnProperty(key) && trolleyData[key].select) {
        temp.push(trolleyData[key]);
      }
    }
    var totalMoney = 0;
    temp.forEach(item => {
      if (item.select) {
        totalMoney += item.price * item.number;
        item.totalMoney = (item.price * item.number).toFixed(2);
      }
    })
    totalMoney = totalMoney.toFixed(2);
    this.setData({
      goodsList: temp,
      totalMoney: totalMoney
    })
    app.api('/wechat/Address/getDefault', null, (status, res) => {
      if (status) {
        if (res.data) {
          this.setData({
            address: res.data,
            hasAddress: true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var address = wx.getStorageSync('address')
    if (address) {
      this.setData({
        address: address,
        hasAddress: true
      });
      wx.removeStorageSync('address');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})